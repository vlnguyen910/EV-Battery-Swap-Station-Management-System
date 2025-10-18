import { Module } from '@nestjs/common';
import { SwapTransactionsService } from './swap-transactions.service';
import { SwapTransactionsController } from './swap-transactions.controller';
import { UsersModule } from '../users/users.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { StationsModule } from '../stations/stations.module';
import { BatteriesModule } from '../batteries/batteries.module';
import { DatabaseModule } from '../database/database.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    VehiclesModule,
    StationsModule,
    BatteriesModule,
    SubscriptionsModule
  ],
  controllers: [SwapTransactionsController],
  providers: [SwapTransactionsService],
  exports: [SwapTransactionsService],
})
export class SwapTransactionsModule { }
