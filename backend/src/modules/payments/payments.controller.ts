import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { PaymentsService } from './payments.service';
import { FeeCalculationService } from './services/fee-calculation.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MockPaymentDto } from './dto/mock-payment.dto';
import { CreatePaymentWithFeesDto } from './dto/create-payment-with-fees.dto';
import {
  CalculateSubscriptionFeeDto,
  CalculateOverchargeFeeDto,
  CalculateDamageFeeDto,
  CalculateComplexFeeDto,
} from './dto/fee-calculation.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly feeCalculationService: FeeCalculationService,
  ) {}

  /**
   * ⭐ OLD ENDPOINT - Keep for backward compatibility
   * Create VNPAY payment URL (subscription only - payment_type will be set to 'subscription')
   * POST /payments/create-vnpay-url
   */
  @Post('create-vnpay-url')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('driver', 'admin')
  async createVnpayUrl(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req: Request,
  ) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string) ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    // Force payment_type to 'subscription' for backward compatibility
    createPaymentDto.payment_type = 'subscription' as any;

    return this.paymentsService.createPaymentUrl(createPaymentDto, ipAddr);
  }

  /**
   * ⭐ NEW ENDPOINT - Support multiple payment types
   * Create VNPAY payment URL with flexible payment types
   * POST /payments/create-vnpay-url-advanced
   * 
   * Supported payment_type:
   * - subscription (default)
   * - subscription_with_deposit (first time + deposit)
   * - battery_deposit (only deposit)
   * - battery_replacement (replace battery)
   * - damage_fee (pay damage)
   * - other (misc)
   */
  @Post('create-vnpay-url-advanced')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('driver', 'admin')
  async createVnpayUrlAdvanced(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req: Request,
  ) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string) ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    return this.paymentsService.createPaymentUrl(createPaymentDto, ipAddr);
  }

  /**
   * VNPAY return URL (redirect from VNPAY)
   * GET /payments/vnpay-return?vnp_Amount=...&vnp_BankCode=...
   */
  @Get('vnpay-return')
  async vnpayReturn(@Query() query: any, @Res() res: Response) {
    try {
      const result = await this.paymentsService.handleVnpayReturn(query);

      // Redirect to frontend with result
      if (result.status === 'success') {
        const subscriptionId = result.subscription_id || '';
        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/success?subscription_id=${subscriptionId}`,
        );
      } else {
        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/failed?code=${result.vnp_response_code}`,
        );
      }
    } catch (error) {
      return res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/error?message=${error.message}`,
      );
    }
  }

  /**
   * VNPAY IPN (Instant Payment Notification)
   * GET /payments/vnpay-ipn?vnp_Amount=...&vnp_BankCode=...
   */
  @Get('vnpay-ipn')
  async vnpayIPN(@Query() query: any) {
    return this.paymentsService.handleVnpayIPN(query);
  }

  /**
   * Get payment by ID
   * GET /payments/:id
   */
  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  /**
   * Get payment by transaction reference
   * GET /payments/txn/:vnpTxnRef
   */
  @Get('txn/:vnpTxnRef')
  @UseGuards(AuthGuard, RolesGuard)
  findByTxnRef(@Param('vnpTxnRef') vnpTxnRef: string) {
    return this.paymentsService.findByTxnRef(vnpTxnRef);
  }

  /**
   * Get user's payment history
   * GET /payments/user/:userId
   */
  @Get('user/:userId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('driver', 'admin')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.paymentsService.findByUser(userId);
  }

  /**
   * Get all payments (admin)
   * GET /payments
   */
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.paymentsService.findAll();
  }

  /**
   * Mock payment for testing (simulate VNPAY without redirect)
   * POST /payments/mock-payment
   */
  @Post('mock-payment')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('driver', 'admin')
  async mockPayment(@Body() mockPaymentDto: MockPaymentDto) {
    return this.paymentsService.mockPayment(mockPaymentDto);
  }

  /**
   * ⭐ NEW ENDPOINT - Create payment for battery deposit only
   * POST /payments/battery-deposit
   * 
   * No subscription created, just save deposit
   */
  @Post('battery-deposit')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('driver', 'admin')
  async createBatteryDepositPayment(
    @Body() body: { user_id: number; amount: number; vehicle_id?: number },
    @Req() req: Request,
  ) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string) ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    // Create payment DTO with battery_deposit type
    const paymentDto: CreatePaymentDto = {
      user_id: body.user_id,
      vehicle_id: body.vehicle_id,
      payment_type: 'battery_deposit' as any,
    };

    return this.paymentsService.createBatteryDepositPaymentUrl(paymentDto, body.amount, ipAddr);
  }

  /**
   * ⭐ NEW ENDPOINT - Create payment for damage fee
   * POST /payments/damage-fee
   * 
   * Pay for damage without subscription
   */
  @Post('damage-fee')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('driver', 'admin')
  async createDamageFeePayment(
    @Body() body: { user_id: number; amount: number; vehicle_id?: number; description?: string },
    @Req() req: Request,
  ) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string) ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    // Create payment DTO with damage_fee type
    const paymentDto: CreatePaymentDto = {
      user_id: body.user_id,
      vehicle_id: body.vehicle_id,
      payment_type: 'damage_fee' as any,
      orderDescription: body.description || 'Thanh toán phí hư hỏng',
    };

    return this.paymentsService.createCustomPaymentUrl(paymentDto, body.amount, ipAddr);
  }

  /**
   * ⭐ NEW ENDPOINT - Create payment for battery replacement
   * POST /payments/battery-replacement
   */
  @Post('battery-replacement')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('driver', 'admin')
  async createBatteryReplacementPayment(
    @Body() body: { user_id: number; amount: number; vehicle_id?: number; description?: string },
    @Req() req: Request,
  ) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string) ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    // Create payment DTO with battery_replacement type
    const paymentDto: CreatePaymentDto = {
      user_id: body.user_id,
      vehicle_id: body.vehicle_id,
      payment_type: 'battery_replacement' as any,
      orderDescription: body.description || 'Thanh toán thay thế pin',
    };

    return this.paymentsService.createCustomPaymentUrl(paymentDto, body.amount, ipAddr);
  }

  /**
   * ⭐ FEE CALCULATION ENDPOINTS - Tính phí
   */

  /**
   * Calculate subscription + deposit fee (fixed 400,000 VNĐ)
   * POST /payments/calculate/subscription-fee
   */
  @Post('calculate/subscription-fee')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('driver', 'admin')
  async calculateSubscriptionFee(@Body() dto: CalculateSubscriptionFeeDto) {
    const fee = await this.feeCalculationService.calculateSubscriptionWithDeposit(
      dto.packageId,
    );
    return {
      ...fee,
      breakdown_text: this.feeCalculationService.getBreakdownText(fee),
    };
  }

  /**
   * Calculate overcharge fee (km vượt quá)
   * POST /payments/calculate/overcharge-fee
   */
  @Post('calculate/overcharge-fee')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('driver', 'admin')
  async calculateOverchargeFee(@Body() dto: CalculateOverchargeFeeDto) {
    const fee = await this.feeCalculationService.calculateOverchargeFee(
      dto.subscriptionId,
      dto.actualDistanceTraveled,
    );
    return {
      ...fee,
      breakdown_text: this.feeCalculationService.getBreakdownText(fee),
    };
  }

  /**
   * Calculate damage fee
   * POST /payments/calculate/damage-fee
   */
  @Post('calculate/damage-fee')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('driver', 'admin')
  async calculateDamageFee(@Body() dto: CalculateDamageFeeDto) {
    const fee = await this.feeCalculationService.calculateDamageFee(dto.damageSeverity);
    return {
      ...fee,
      breakdown_text: this.feeCalculationService.getBreakdownText(fee),
    };
  }

  /**
   * Calculate complex fee (multiple fee types at once)
   * POST /payments/calculate/complex-fee
   */
  @Post('calculate/complex-fee')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('driver', 'admin')
  async calculateComplexFee(@Body() dto: CalculateComplexFeeDto) {
    const fee = await this.feeCalculationService.calculateComplexFee(dto);
    return {
      ...fee,
      breakdown_text: this.feeCalculationService.getBreakdownText(fee),
    };
  }

  /**
   * ⭐ NEW ENDPOINT - Integrated Fee Calculation + VNPay Payment URL
   * Combines fee calculation with VNPAY URL creation in one endpoint
   * 
   * Usage Examples:
   * 1. Subscription with deposit:
   *    { "user_id": 1, "package_id": 1, "vehicle_id": 1, "payment_type": "subscription_with_deposit" }
   * 
   * 2. Damage fee:
   *    { "user_id": 1, "package_id": 1, "vehicle_id": 1, "payment_type": "damage_fee", "damage_type": "medium" }
   * 
   * Response includes:
   * - paymentUrl: Ready-to-use VNPAY payment URL
   * - feeBreakdown: Detailed fee calculation breakdown
   * - payment_id & vnp_txn_ref: For tracking and reconciliation
   * 
   * POST /payments/calculate-and-create-vnpay-url
   */
  @Post('calculate-and-create-vnpay-url')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('driver', 'admin')
  async createPaymentUrlWithFees(
    @Body() createPaymentWithFeesDto: CreatePaymentWithFeesDto,
    @Req() req: Request,
  ) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string) ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      '0.0.0.0';

    return this.paymentsService.createPaymentUrlWithFees(
      createPaymentWithFeesDto,
      ipAddr,
    );
  }
}

