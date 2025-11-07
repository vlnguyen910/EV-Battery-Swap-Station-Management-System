import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentsService } from '../payments.service';

@Injectable()
export class PaymentExpiryTask {
  private readonly logger = new Logger(PaymentExpiryTask.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Chạy mỗi 5 phút để cancel các payment đã expired
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleExpiredPayments() {
    this.logger.log('🔍 Checking for expired payments...');
    
    try {
      const count = await this.paymentsService.cancelExpiredPayments();
      
      if (count > 0) {
        this.logger.log(`✅ Cancelled ${count} expired payment(s)`);
      } else {
        this.logger.debug('No expired payments found');
      }
    } catch (error) {
      this.logger.error('❌ Error cancelling expired payments:', error);
    }
  }
}
