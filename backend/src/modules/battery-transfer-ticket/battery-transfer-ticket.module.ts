import { Module } from '@nestjs/common';
import { BatteryTransferTicketService } from './battery-transfer-ticket.service';
import { BatteryTransferTicketController } from './battery-transfer-ticket.controller';
import { DatabaseModule } from '../database/database.module';
import { StationsModule } from '../stations/stations.module';
import { UsersModule } from '../users/users.module';
import { BatteriesModule } from '../batteries/batteries.module';
import { BatteryTransferRequestModule } from '../battery-transfer-request/battery-transfer-request.module';

@Module({
  imports: [
    DatabaseModule,
    StationsModule,
    UsersModule,
    BatteriesModule,
    BatteryTransferRequestModule,
  ],
  controllers: [BatteryTransferTicketController],
  providers: [BatteryTransferTicketService],
  exports: [BatteryTransferTicketService],
})
export class BatteryTransferTicketModule { }
