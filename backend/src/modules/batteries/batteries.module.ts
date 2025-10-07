import { Module } from '@nestjs/common';
import { BatteriesService } from './batteries.service';
import { BatteriesController } from './batteries.controller';
import { DatabaseModule } from '../database/database.module';
import { VehiclesModule } from '../vehicles/vehicles.module';

@Module({
  imports: [DatabaseModule, VehiclesModule],
  controllers: [BatteriesController],
  providers: [BatteriesService],
  exports: [BatteriesService],
})
export class BatteriesModule { }
