import { Module } from '@nestjs/common';
import { SwapTransactionsService } from './swap-transactions.service';
import { SwapTransactionsController } from './swap-transactions.controller';
import { UsersModule } from '../users/users.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { StationsModule } from '../stations/stations.module';
import { BatteriesModule } from '../batteries/batteries.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    VehiclesModule,
    StationsModule,
    BatteriesModule
  ],
  controllers: [SwapTransactionsController],
  providers: [SwapTransactionsService],
})
export class SwapTransactionsModule { }
