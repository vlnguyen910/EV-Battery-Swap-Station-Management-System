import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MockPaymentDto } from './dto/mock-payment.dto';
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
import { PaymentMethod, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: DatabaseService) {}

  /**
   * Create VNPAY payment URL for subscription
   */
  async createPaymentUrl(createPaymentDto: CreatePaymentDto, ipAddr: string) {
    // 1. Get package information
    const servicePackage = await this.prisma.batteryServicePackage.findUnique({
      where: { package_id: createPaymentDto.package_id },
    });

    if (!servicePackage) {
      throw new NotFoundException('Package not found');
    }

    if (!servicePackage.active) {
      throw new BadRequestException('Package is not active');
    }

    // 2. Create payment record with pending status
    const vnpTxnRef = moment().format('DDHHmmss'); // Unique transaction reference
    const amount = Math.floor(servicePackage.base_price.toNumber() * 100); // Convert to VND cents (integer only)

    const payment = await this.prisma.payment.create({
      data: {
        user_id: createPaymentDto.user_id,
        package_id: createPaymentDto.package_id,
        vehicle_id: createPaymentDto.vehicle_id, // Save vehicle_id for subscription
        amount: servicePackage.base_price,
        method: PaymentMethod.vnpay,
        status: PaymentStatus.pending,
        vnp_txn_ref: vnpTxnRef,
        order_info:
          createPaymentDto.orderDescription ||
          `Thanh toan goi ${servicePackage.name}`,
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

    // If payment successful, create subscription
    if (paymentStatus === PaymentStatus.success && payment.package) {
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

      return {
        success: true,
        message: 'Payment successful',
        payment: updatedPayment,
        subscription,
      };
    }

    return {
      success: false,
      message: 'Payment failed',
      payment: updatedPayment,
      responseCode,
    };
  }

  /**
   * Handle VNPAY IPN (Instant Payment Notification)
   */
  async handleVnpayIPN(vnpParams: any) {
    try {
      const result = await this.handleVnpayReturn(vnpParams);

      if (result.success) {
        return {
          RspCode: '00',
          Message: 'Confirm Success',
        };
      } else {
        return {
          RspCode: '99',
          Message: 'Payment failed',
        };
      }
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
}

