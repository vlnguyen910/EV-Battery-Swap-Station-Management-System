import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule } from '../database/database.module';
import { BatteriesModule } from '../batteries/batteries.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { UsersModule } from '../users/users.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { StationsModule } from '../stations/stations.module';

@Module({
  imports: [BatteriesModule, DatabaseModule, VehiclesModule, UsersModule, SubscriptionsModule, StationsModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule { }
