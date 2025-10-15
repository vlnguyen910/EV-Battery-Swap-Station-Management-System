import { Module } from '@nestjs/common';
import { SwappingService } from './swapping.service';
import { SwappingController } from './swapping.controller';
import { UsersModule } from '../users/users.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { BatteriesModule } from '../batteries/batteries.module';
import { StationsModule } from '../stations/stations.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [
    UsersModule,
    VehiclesModule,
    BatteriesModule,
    StationsModule,
    SubscriptionsModule,
  ],
  controllers: [SwappingController],
  providers: [SwappingService],
})
export class SwappingModule { }
