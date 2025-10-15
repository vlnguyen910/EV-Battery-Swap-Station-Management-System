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
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MockPaymentDto } from './dto/mock-payment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Create VNPAY payment URL
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
      if (result.success) {
        const subscriptionId = result.subscription?.subscription_id || '';
        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/success?subscription_id=${subscriptionId}`,
        );
      } else {
        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/failed?code=${result.responseCode}`,
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
}

