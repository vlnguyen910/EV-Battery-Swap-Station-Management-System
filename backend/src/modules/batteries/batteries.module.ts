import { Module } from '@nestjs/common';
import { BatteriesService } from './batteries.service';
import { BatteriesController } from './batteries.controller';
import { DatabaseModule } from '../database/database.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { StationsModule } from '../stations/stations.module';

@Module({
  imports: [
    DatabaseModule,
    VehiclesModule,
    StationsModule
  ],
  controllers: [BatteriesController],
  providers: [BatteriesService],
  exports: [BatteriesService],
})
export class BatteriesModule { }
