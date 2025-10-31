import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { FeeCalculationService } from './services/fee-calculation.service';
import { PaymentsController } from './payments.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PaymentsService, FeeCalculationService],
  controllers: [PaymentsController],
  exports: [PaymentsService, FeeCalculationService],
})
export class PaymentsModule {}
