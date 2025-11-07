import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MockPaymentDto } from './dto/mock-payment.dto';
import { CreatePaymentWithFeesDto, PaymentWithFeesResponse } from './dto/create-payment-with-fees.dto';
import { vnpayConfig } from './config/vnpay.config';
import {
  validateVNPayParams,
  generateSecureHash,
  logVNPayParams,
  sortObject,
} from './utils/vnpay.utils';
import * as crypto from 'crypto';
import * as qs from 'qs';
import moment from 'moment';
import { PaymentMethod, PaymentStatus, PaymentType, SubscriptionStatus } from '@prisma/client';
import { FeeCalculationService } from './services/fee-calculation.service';
import { BatteryServicePackagesService } from '../battery-service-packages/battery-service-packages.service';
import { CreateDirectPaymentDto } from './dto/create-direct-payment.dto';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
@Injectable()
export class PaymentsService {
  constructor(
    private prisma: DatabaseService,
    @Inject(FeeCalculationService)
    private feeCalculationService: FeeCalculationService,
    private batteryServicePackage: BatteryServicePackagesService,
    private subscriptionsService: SubscriptionsService
  ) { }


  /**
   * Create VNPAY payment URL for subscription
   */
  async createPaymentUrl(createPaymentDto: CreatePaymentDto, ipAddr: string) {
    // 1. Get package information (if package_id exists)
    let servicePackage: any = null;
    let amount: number;

    if (createPaymentDto.package_id) {
      servicePackage = await this.prisma.batteryServicePackage.findUnique({
        where: { package_id: createPaymentDto.package_id },
      });

      if (!servicePackage) {
        throw new NotFoundException('Package not found');
      }

      if (!servicePackage.active) {
        throw new BadRequestException('Package is not active');
      }

      amount = Math.floor(servicePackage.base_price.toNumber() * 100);
    } else if (createPaymentDto.payment_type !== 'subscription' && createPaymentDto.payment_type !== 'subscription_with_deposit') {
      // Nếu không có package_id và không phải subscription, cần lấy amount từ đâu đó
      amount = 0; // TODO: Xác định amount dựa trên payment_type
    } else {
      throw new BadRequestException('package_id is required for subscription payment');
    }

    // 2. Create payment record with pending status
    const vnpTxnRef = moment().format('DDHHmmss');

    const payment = await this.prisma.payment.create({
      data: {
        user_id: createPaymentDto.user_id,
        package_id: createPaymentDto.package_id,
        vehicle_id: createPaymentDto.vehicle_id,
        amount: servicePackage?.base_price || 0,
        method: PaymentMethod.vnpay,
        status: PaymentStatus.pending,
        payment_type: createPaymentDto.payment_type as any,
        vnp_txn_ref: vnpTxnRef,
        order_info:
          createPaymentDto.orderDescription ||
          (servicePackage ? `Thanh toan goi ${servicePackage.name}` : `Thanh toan ${createPaymentDto.payment_type}`),
      },
    });

    // 3. Build VNPAY payment URL
    const createDate = moment().format('YYYYMMDDHHmmss');

    // Build params - values will be encoded by sortObject()
    let vnpParams: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_Locale: createPaymentDto.language || 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: vnpTxnRef,
      vnp_OrderInfo: payment.order_info,
      vnp_OrderType: 'other',
      vnp_Amount: amount, // Already multiplied by 100 at line 44
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    // Sort and encode params (VNPAY style)
    vnpParams = sortObject(vnpParams);

    // Create signature from encoded query string
    const signData = qs.stringify(vnpParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Add signature to params
    vnpParams['vnp_SecureHash'] = signed;

    // Log for debugging
    console.log('========== VNPAY Payment URL Generation ==========');
    console.log('TMN_CODE:', vnpayConfig.vnp_TmnCode);
    console.log('Secret (first 15 chars):', vnpayConfig.vnp_HashSecret.substring(0, 15) + '...');
    console.log('Sign data:', signData);
    console.log('Signature:', signed);

    // Build payment URL
    const paymentUrl = vnpayConfig.vnp_Url + '?' + qs.stringify(vnpParams, { encode: false });

    console.log('Final payment URL:', paymentUrl);
    console.log('==================================================');

    return {
      paymentUrl,
      payment_id: payment.payment_id,
      vnp_txn_ref: vnpTxnRef,
      debug_params: {
        ...sortObject(vnpParams),
        vnp_SecureHash: signed,
      }, // For debugging
    };
  }

  /**
   * Handle VNPAY return callback
   */
  async handleVnpayReturn(vnpParams: any) {
    const secureHash = vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    // Sort and encode params (VNPAY style)
    const sortedParams = sortObject(vnpParams);

    // Verify signature
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash !== signed) {
      throw new BadRequestException('Invalid signature');
    }

    // Get payment record
    const payment = await this.prisma.payment.findUnique({
      where: { vnp_txn_ref: vnpParams['vnp_TxnRef'] },
      include: {
        package: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Check response code
    const responseCode = vnpParams['vnp_ResponseCode'];
    const transactionStatus = vnpParams['vnp_TransactionStatus'];

    let paymentStatus: PaymentStatus;
    if (responseCode === '00' && transactionStatus === '00') {
      paymentStatus = PaymentStatus.success;
    } else {
      paymentStatus = PaymentStatus.failed;
    }

    // Update payment record
    const updatedPayment = await this.prisma.payment.update({
      where: { payment_id: payment.payment_id },
      data: {
        status: paymentStatus,
        transaction_id: vnpParams['vnp_TransactionNo'],
        vnp_response_code: responseCode,
        vnp_bank_code: vnpParams['vnp_BankCode'],
        vnp_card_type: vnpParams['vnp_CardType'],
        payment_time: moment(
          vnpParams['vnp_PayDate'],
          'YYYYMMDDHHmmss',
        ).toDate(),
      },
      include: {
        package: true,
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // If payment successful, handle based on payment_type
    if (paymentStatus === PaymentStatus.success) {
      await this.handleSuccessfulPayment(payment);
    }

    return updatedPayment;
  }

  /**
   * Handle successful payment based on payment_type
   */
  private async handleSuccessfulPayment(payment: any) {
    const paymentType = payment.payment_type;

    switch (paymentType) {
      case 'subscription':
        // Thanh toán gói đăng ký thường
        await this.createSubscriptionFromPayment(payment);
        break;

      case 'subscription_with_deposit':
        // Thanh toán gói + tiền đặt cọc pin
        // Tách số tiền: gói đăng ký + phí đặt cọc pin
        await this.createSubscriptionWithDeposit(payment);
        break;

      case 'battery_deposit':
        // Chỉ thanh toán tiền đặt cọc pin - không tạo subscription
        console.log(`Battery deposit payment processed for user ${payment.user_id}`);
        // Có thể lưu thông tin deposit vào user hoặc bảng khác
        break;

      case 'battery_replacement':
        // Thanh toán thay thế pin
        console.log(`Battery replacement payment processed for user ${payment.user_id}`);
        // Xử lý logic thay thế pin
        break;

      case 'damage_fee':
        // Thanh toán phí hư hỏng
        console.log(`Damage fee payment processed for user ${payment.user_id}`);
        // Xử lý logic phí hư hỏng
        break;

      case 'other':
      default:
        console.log(`Other payment type processed for user ${payment.user_id}`);
        break;
    }
  }

  /**
   * Create subscription from standard subscription payment
   */
  private async createSubscriptionFromPayment(payment: any) {
    if (!payment.package) return;

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + payment.package.duration_days);

    const subscription = await this.prisma.subscription.create({
      data: {
        user_id: payment.user_id,
        package_id: payment.package_id || 0,
        vehicle_id: payment.vehicle_id, // Assign vehicle_id from payment
        start_date: startDate,
        end_date: endDate,
        status: 'active',
        swap_used: 0,
      },
    });

    // Link payment to subscription
    await this.prisma.payment.update({
      where: { payment_id: payment.payment_id },
      data: { subscription_id: subscription.subscription_id },
    });

    return subscription;
  }

  /**
   * Create subscription with deposit payment
   * Tách tiền thanh toán: phí gói + phí đặt cọc pin
   * Đánh dấu deposit_paid = true
   */
  private async createSubscriptionWithDeposit(payment: any) {
    if (!payment.package) return;

    // Ở đây bạn có thể tách tiền thành 2 phần:
    // - Phần 1: Tiền gói đăng ký (package.base_price)
    // - Phần 2: Tiền đặt cọc pin (được lấy từ ConfigService)

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + payment.package.duration_days);

    const subscription = await this.prisma.subscription.create({
      data: {
        user_id: payment.user_id,
        package_id: payment.package_id || 0,
        vehicle_id: payment.vehicle_id,
        start_date: startDate,
        end_date: endDate,
        status: 'active',
        swap_used: 0,
        deposit_paid: true, // Đã thanh toán cọc
      },
    });

    // Link payment to subscription
    await this.prisma.payment.update({
      where: { payment_id: payment.payment_id },
      data: { subscription_id: subscription.subscription_id },
    });

    return subscription;
  }

  /**
   * Create payment URL for battery deposit (no package required)
   */
  async createBatteryDepositPaymentUrl(createPaymentDto: CreatePaymentDto, amount: number, ipAddr: string) {
    // 1. Create payment record with pending status
    const vnpTxnRef = moment().format('DDHHmmss');

    const payment = await this.prisma.payment.create({
      data: {
        user_id: createPaymentDto.user_id,
        vehicle_id: createPaymentDto.vehicle_id,
        amount: amount,
        method: PaymentMethod.vnpay,
        status: PaymentStatus.pending,
        payment_type: 'battery_deposit' as any,
        vnp_txn_ref: vnpTxnRef,
        order_info: createPaymentDto.orderDescription || 'Nạp tiền cọc pin',
      },
    });

    // 2. Build VNPAY payment URL
    return this._buildVnpayUrl(payment, vnpTxnRef, amount, ipAddr);
  }

  /**
   * Create payment URL for custom amount (damage fee, battery replacement, etc.)
   */
  async createCustomPaymentUrl(createPaymentDto: CreatePaymentDto, amount: number, ipAddr: string) {
    // 1. Create payment record with pending status
    const vnpTxnRef = moment().format('DDHHmmss');

    const payment = await this.prisma.payment.create({
      data: {
        user_id: createPaymentDto.user_id,
        vehicle_id: createPaymentDto.vehicle_id,
        amount: amount,
        method: PaymentMethod.vnpay,
        status: PaymentStatus.pending,
        payment_type: createPaymentDto.payment_type as any,
        vnp_txn_ref: vnpTxnRef,
        order_info: createPaymentDto.orderDescription || `Thanh toán ${createPaymentDto.payment_type}`,
      },
    });

    // 2. Build VNPAY payment URL
    return this._buildVnpayUrl(payment, vnpTxnRef, amount, ipAddr);
  }

  /**
   * Helper method to build VNPAY URL
   */
  private _buildVnpayUrl(payment: any, vnpTxnRef: string, amount: number, ipAddr: string) {
    const createDate = moment().format('YYYYMMDDHHmmss');
    const amountCents = Math.floor(amount * 100);

    let vnpParams: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: vnpTxnRef,
      vnp_OrderInfo: payment.order_info,
      vnp_OrderType: 'other',
      vnp_Amount: amountCents,
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    vnpParams = sortObject(vnpParams);

    const signData = qs.stringify(vnpParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    vnpParams['vnp_SecureHash'] = signed;

    const paymentUrl = vnpayConfig.vnp_Url + '?' + qs.stringify(vnpParams, { encode: false });

    return {
      paymentUrl,
      payment_id: payment.payment_id,
      vnp_txn_ref: vnpTxnRef,
    };
  }


  async handleVnpayIPN(vnpParams: any) {
    try {
      await this.handleVnpayReturn(vnpParams);

      return {
        RspCode: '00',
        Message: 'Confirm Success',
      };
    } catch (error) {
      return {
        RspCode: '99',
        Message: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Get payment by ID
   */
  async findOne(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { payment_id: id },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
        package: true,
        subscription: true,
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  /**
   * Get user's payment history
   */
  async findByUser(userId: number) {
    return this.prisma.payment.findMany({
      where: { user_id: userId },
      include: {
        package: true,
        subscription: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  /**
   * Get all payments (admin)
   */
  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
        package: true,
        subscription: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  /**
   * Query payment by transaction reference
   */
  async findByTxnRef(vnpTxnRef: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { vnp_txn_ref: vnpTxnRef },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
        package: true,
        subscription: true,
      },
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment with TxnRef ${vnpTxnRef} not found`,
      );
    }

    return payment;
  }

  /**
  /**
   * Mock payment for testing (simulate VNPAY flow without redirect)
   */
  async mockPayment(mockPaymentDto: MockPaymentDto) {
    // 1. Get package information
    const servicePackage = await this.prisma.batteryServicePackage.findUnique({
      where: { package_id: mockPaymentDto.package_id },
    });

    if (!servicePackage) {
      throw new NotFoundException('Package not found');
    }

    if (!servicePackage.active) {
      throw new BadRequestException('Package is not active');
    }

    // 2. Create payment record
    const vnpTxnRef = moment().format('DDHHmmss');
    const responseCode = mockPaymentDto.vnp_response_code || '00'; // Default success

    const payment = await this.prisma.payment.create({
      data: {
        user_id: mockPaymentDto.user_id,
        package_id: mockPaymentDto.package_id,
        vehicle_id: mockPaymentDto.vehicle_id, // Save vehicle_id for subscription
        amount: servicePackage.base_price,
        method: PaymentMethod.vnpay,
        status: PaymentStatus.pending,
        vnp_txn_ref: vnpTxnRef,
        order_info: `Mock payment for ${servicePackage.name}`,
      },
    });

    // 3. Simulate VNPAY response
    const mockVnpParams = {
      vnp_Amount: (servicePackage.base_price.toNumber() * 100).toString(),
      vnp_BankCode: mockPaymentDto.vnp_bank_code || 'NCB',
      vnp_BankTranNo: `MOCK${moment().format('YYYYMMDDHHmmss')}`,
      vnp_CardType: mockPaymentDto.vnp_card_type || 'ATM',
      vnp_OrderInfo: payment.order_info || '',
      vnp_PayDate: moment().format('YYYYMMDDHHmmss'),
      vnp_ResponseCode: responseCode,
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_TransactionNo: `${Date.now()}`,
      vnp_TransactionStatus: responseCode === '00' ? '00' : '01',
      vnp_TxnRef: vnpTxnRef,
    };

    // 4. Determine payment status
    let paymentStatus: PaymentStatus;
    if (responseCode === '00') {
      paymentStatus = PaymentStatus.success;
    } else if (responseCode === '24') {
      paymentStatus = PaymentStatus.cancelled;
    } else {
      paymentStatus = PaymentStatus.failed;
    }

    // 5. Update payment
    const updatedPayment = await this.prisma.payment.update({
      where: { payment_id: payment.payment_id },
      data: {
        status: paymentStatus,
        transaction_id: mockVnpParams.vnp_TransactionNo,
        vnp_response_code: responseCode,
        vnp_bank_code: mockVnpParams.vnp_BankCode,
        vnp_card_type: mockVnpParams.vnp_CardType,
        payment_time: moment(
          mockVnpParams.vnp_PayDate,
          'YYYYMMDDHHmmss',
        ).toDate(),
      },
      include: {
        package: true,
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // 6. If success, create subscription
    let subscription: any = null;
    if (paymentStatus === PaymentStatus.success && servicePackage) {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + servicePackage.duration_days);

      subscription = await this.prisma.subscription.create({
        data: {
          user_id: mockPaymentDto.user_id,
          package_id: mockPaymentDto.package_id,
          vehicle_id: mockPaymentDto.vehicle_id,
          start_date: startDate,
          end_date: endDate,
          status: 'active',
          swap_used: 0,
        },
        include: {
          package: true,
          vehicle: true,
        },
      });

      // Link payment to subscription
      if (subscription) {
        await this.prisma.payment.update({
          where: { payment_id: payment.payment_id },
          data: { subscription_id: subscription.subscription_id },
        });
      }
    }

    return {
      success: paymentStatus === PaymentStatus.success,
      payment: updatedPayment,
      subscription,
      mock_response: mockVnpParams,
      message:
        paymentStatus === PaymentStatus.success
          ? 'Payment successful, subscription created'
          : paymentStatus === PaymentStatus.cancelled
            ? 'Payment cancelled by user'
            : 'Payment failed',
    };
  }

  /**
   * Create VNPAY payment URL with integrated fee calculation
   * 
   * Flow:
   * 1. Get package base price
   * 2. Calculate fee amount based on fee type and parameters
   * 3. Create payment record with total amount (base + fee)
   * 4. Generate VNPAY URL with calculated total amount
   * 5. Return payment URL, payment ID, and fee breakdown
   */
  async createPaymentUrlWithFees(
    createPaymentWithFeesDto: CreatePaymentWithFeesDto,
    ipAddr: string,
  ): Promise<PaymentWithFeesResponse> {
    // 1. Get package information
    const servicePackage = await this.prisma.batteryServicePackage.findUnique({
      where: { package_id: createPaymentWithFeesDto.package_id },
    });

    if (!servicePackage) {
      throw new NotFoundException('Package not found');
    }

    if (!servicePackage.active) {
      throw new BadRequestException('Package is not active');
    }

    // 2. Check if user has existing subscription for this vehicle (to determine deposit status)
    let existingSubscription: any = null;
    if (createPaymentWithFeesDto.vehicle_id) {
      existingSubscription = await this.prisma.subscription.findFirst({
        where: {
          user_id: createPaymentWithFeesDto.user_id,
          vehicle_id: createPaymentWithFeesDto.vehicle_id,
          status: SubscriptionStatus.active,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    }

    // 3. Calculate fee based on fee type
    let feeAmount = 0;
    let feeBreakdownText = '';
    let feeDetails: any = {
      baseAmount: servicePackage.base_price.toNumber(),
      totalAmount: 0,
    };

    // Call appropriate fee calculation method
    switch (createPaymentWithFeesDto.payment_type) {
      case 'subscription_with_deposit':
        // Check deposit status from existing subscription
        const depositResult = await this.feeCalculationService.calculateSubscriptionWithDeposit(
          createPaymentWithFeesDto.package_id,
          existingSubscription?.subscription_id, // Pass subscription_id to check deposit status
        );
        feeAmount = depositResult.deposit_fee;
        
        // Update breakdown text based on whether deposit is included
        if (depositResult.deposit_fee > 0) {
          feeBreakdownText = `Gói: ${depositResult.breakdown.package_price.toLocaleString('vi-VN')} VND, Cọc: ${depositResult.deposit_fee.toLocaleString('vi-VN')} VND, Tổng: ${depositResult.total_fee.toLocaleString('vi-VN')} VND`;
        } else {
          feeBreakdownText = `Gói: ${depositResult.breakdown.package_price.toLocaleString('vi-VN')} VND (Đã đặt cọc trước đó), Tổng: ${depositResult.total_fee.toLocaleString('vi-VN')} VND`;
        }
        feeDetails.depositFee = depositResult.deposit_fee;
        feeDetails.depositAlreadyPaid = existingSubscription?.deposit_paid || false;
        break;

      case 'battery_replacement':
        // Nếu có distance_traveled, tính overcharge fee
        if (createPaymentWithFeesDto.distance_traveled) {
          // Cần subscription_id - nếu không có, skip overcharge
          // Trong trường hợp này, ta sẽ không tính overcharge vì không có subscription context
          feeAmount = 0;
          feeBreakdownText = `Thanh toán thay pin: ${servicePackage.base_price.toNumber().toLocaleString('vi-VN')} VND`;
        }
        break;

      case 'damage_fee':
        if (createPaymentWithFeesDto.damage_type) {
          // Map damage_type từ DTO sang service (low->minor, medium->moderate, high->severe)
          const damageTypeMapping = {
            'low': 'minor',
            'medium': 'moderate',
            'high': 'severe',
          };
          const mappedDamageType = damageTypeMapping[createPaymentWithFeesDto.damage_type] as 'minor' | 'moderate' | 'severe';

          const damageResult = await this.feeCalculationService.calculateDamageFee(mappedDamageType);
          feeAmount = damageResult.damage_fee;
          feeBreakdownText = `Phí hư hỏng: ${damageResult.damage_fee.toLocaleString('vi-VN')} VND`;
          feeDetails.damageFee = damageResult.damage_fee;
        }
        break;

      case 'subscription':
      case 'other':
      default:
        // Không tính phí, chỉ dùng giá gói
        feeAmount = 0;
        feeBreakdownText = `Tổng tiền: ${servicePackage.base_price.toNumber().toLocaleString('vi-VN')} VND`;
        break;
    }

    // 3. Calculate total amount
    const totalAmount = servicePackage.base_price.toNumber() + feeAmount;
    feeDetails.totalAmount = totalAmount;
    feeDetails.breakdown_text = feeBreakdownText;

    // 4. Create payment record with calculated total amount
    const vnpTxnRef = moment().format('DDHHmmss');

    const payment = await this.prisma.payment.create({
      data: {
        user_id: createPaymentWithFeesDto.user_id,
        package_id: createPaymentWithFeesDto.package_id,
        vehicle_id: createPaymentWithFeesDto.vehicle_id,
        amount: totalAmount, // Total amount including fee
        method: PaymentMethod.vnpay,
        status: PaymentStatus.pending,
        payment_type: createPaymentWithFeesDto.payment_type as any,
        vnp_txn_ref: vnpTxnRef,
        order_info:
          createPaymentWithFeesDto.order_info ||
          `Thanh toan ${servicePackage.name}${feeAmount > 0 ? ' + phí' : ''}`,
      },
    });

    // 5. Build VNPAY payment URL with total amount
    const createDate = moment().format('YYYYMMDDHHmmss');
    const vnpAmount = Math.floor(totalAmount * 100); // Convert to VND cents

    let vnpParams: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_Locale: createPaymentWithFeesDto.language || 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: vnpTxnRef,
      vnp_OrderInfo: payment.order_info,
      vnp_OrderType: 'other',
      vnp_Amount: vnpAmount,
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    // Sort and encode params (VNPAY style)
    vnpParams = sortObject(vnpParams);

    // Create signature from encoded query string
    const signData = qs.stringify(vnpParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Add signature to params
    vnpParams['vnp_SecureHash'] = signed;

    // Log for debugging
    console.log('========== VNPAY Payment URL with Fees ==========');
    console.log('Base Amount:', feeDetails.baseAmount);
    console.log('Fee Amount:', feeAmount);
    console.log('Total Amount:', totalAmount);
    console.log('Payment Type:', createPaymentWithFeesDto.payment_type);
    console.log('Fee Breakdown:', feeBreakdownText);
    console.log('VNPay Amount (cents):', vnpAmount);

    // Build payment URL
    const paymentUrl = vnpayConfig.vnp_Url + '?' + qs.stringify(vnpParams, { encode: false });

    return {
      payment_id: payment.payment_id,
      paymentUrl,
      vnp_txn_ref: vnpTxnRef,
      feeBreakdown: {
        baseAmount: feeDetails.baseAmount,
        depositFee: feeDetails.depositFee,
        overchargeFee: feeDetails.overchargeFee,
        damageFee: feeDetails.damageFee,
        totalAmount: feeDetails.totalAmount,
        breakdown_text: feeDetails.breakdown_text,
      },
      paymentInfo: {
        user_id: payment.user_id,
        package_id: payment.package_id ?? 0,
        vehicle_id: payment.vehicle_id ?? 0,
        payment_type: payment.payment_type,
        status: payment.status,
        created_at: payment.created_at.toISOString(),
      },
    };
  }

  /**
   * Create direct payment with fees calculation (without VNPAY)
   * This method:
   * 1. Calculates fees based on payment_type
   * 2. Creates payment record with success status immediately
   * 3. Creates subscription immediately (if applicable)
   * 4. Returns detailed fee breakdown
   * 
   * Use for: Demo, testing, or when VNPAY is unavailable
   */
  async createDirectPaymentWithFees(
    createPaymentWithFeesDto: CreateDirectPaymentDto,
  ): Promise<{
    success: boolean;
    payment: any;
    subscription?: any;
    feeBreakdown: any;
    message: string;
  }> {
    try {
      // 1. Get package information
      const servicePackage = await this.prisma.batteryServicePackage.findUnique({
        where: { package_id: createPaymentWithFeesDto.package_id },
      });

      if (!servicePackage) {
        throw new NotFoundException('Package not found');
      }

      if (!servicePackage.active) {
        throw new BadRequestException('Package is not active');
      }

      const existingSubscription = await this.subscriptionsService.findOneByVehicleId(createPaymentWithFeesDto.vehicle_id);
      if (existingSubscription && existingSubscription.status === SubscriptionStatus.active) {
        throw new BadRequestException('This vehicle is already have a subscription, choose other vehicle or cancle current subscription')
      }

      // 2. Calculate fee based on fee type (same logic as createPaymentUrlWithFees)
      let feeAmount = 0;
      let feeBreakdownText = '';
      let feeDetails: any = {
        baseAmount: servicePackage.base_price.toNumber(),
        totalAmount: 0,
      };

      // Call appropriate fee calculation method
      switch (createPaymentWithFeesDto.payment_type) {
        case 'subscription_with_deposit':
          const depositResult = await this.feeCalculationService.calculateSubscriptionWithDeposit(
            createPaymentWithFeesDto.package_id,
            existingSubscription?.subscription_id, // Pass subscription_id to check deposit status
          );
          feeAmount = depositResult.deposit_fee;
          
          // Update breakdown text based on whether deposit is included
          if (depositResult.deposit_fee > 0) {
            feeBreakdownText = `Gói: ${depositResult.breakdown.package_price.toLocaleString('vi-VN')} VND, Cọc: ${depositResult.deposit_fee.toLocaleString('vi-VN')} VND, Tổng: ${depositResult.total_fee.toLocaleString('vi-VN')} VND`;
          } else {
            feeBreakdownText = `Gói: ${depositResult.breakdown.package_price.toLocaleString('vi-VN')} VND (Đã đặt cọc trước đó), Tổng: ${depositResult.total_fee.toLocaleString('vi-VN')} VND`;
          }
          feeDetails.depositFee = depositResult.deposit_fee;
          feeDetails.depositAlreadyPaid = existingSubscription?.deposit_paid || false;
          break;

        case 'battery_replacement':
          if (createPaymentWithFeesDto.distance_traveled) {
            feeAmount = 0;
            feeBreakdownText = `Thanh toán thay pin: ${servicePackage.base_price.toNumber().toLocaleString('vi-VN')} VND`;
          }
          break;

        case 'subscription':
        case 'other':
        default:
          feeAmount = 0;
          feeBreakdownText = `Tổng tiền: ${servicePackage.base_price.toNumber().toLocaleString('vi-VN')} VND`;
          break;
      }

      // 3. Calculate total amount
      const totalAmount = servicePackage.base_price.toNumber() + feeAmount;
      feeDetails.totalAmount = totalAmount;
      feeDetails.breakdown_text = feeBreakdownText;

      // 4. Create payment record with SUCCESS status (direct payment confirmed)
      const payment = await this.prisma.payment.create({
        data: {
          user_id: createPaymentWithFeesDto.user_id,
          package_id: createPaymentWithFeesDto.package_id,
          vehicle_id: createPaymentWithFeesDto.vehicle_id,
          amount: totalAmount, // Total amount including fee
          method: PaymentMethod.cash, // Direct payment method
          status: PaymentStatus.success, // Immediate success
          payment_type: createPaymentWithFeesDto.payment_type as any,
          payment_time: new Date(),
          transaction_id: `DIRECT${moment().format('YYYYMMDDHHmmss')}`,
          order_info:
            createPaymentWithFeesDto.order_info ||
            `Direct payment for ${servicePackage.name}${feeAmount > 0 ? ' + fees' : ''}`,
        },
        include: {
          package: true,
        },
      });

      // 5. Create subscription immediately (if payment_type requires it)
      let subscription: any = null;

      if (
        createPaymentWithFeesDto.payment_type === 'subscription' ||
        createPaymentWithFeesDto.payment_type === 'subscription_with_deposit'
      ) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + servicePackage.duration_days);

        // Set deposit_paid = true if payment type includes deposit
        const depositPaid = createPaymentWithFeesDto.payment_type === 'subscription_with_deposit';

        subscription = await this.prisma.subscription.create({
          data: {
            user_id: createPaymentWithFeesDto.user_id,
            package_id: createPaymentWithFeesDto.package_id,
            vehicle_id: createPaymentWithFeesDto.vehicle_id,
            start_date: startDate,
            end_date: endDate,
            status: 'active',
            swap_used: 0,
            deposit_paid: depositPaid, // Set based on payment type
          },
          include: {
            package: true,
            vehicle: true,
          },
        });

        // Link payment to subscription
        await this.prisma.payment.update({
          where: { payment_id: payment.payment_id },
          data: { subscription_id: subscription.subscription_id },
        });
      }

      // 6. Return detailed response
      return {
        success: true,
        payment: {
          ...payment,
          subscription_id: subscription?.subscription_id,
        },
        subscription,
        feeBreakdown: {
          baseAmount: feeDetails.baseAmount,
          depositFee: feeDetails.depositFee,
          overchargeFee: feeDetails.overchargeFee,
          damageFee: feeDetails.damageFee,
          totalAmount: feeDetails.totalAmount,
          breakdown_text: feeDetails.breakdown_text,
        },
        message: subscription
          ? 'Direct payment with fees processed successfully and subscription created'
          : 'Direct payment with fees processed successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}


