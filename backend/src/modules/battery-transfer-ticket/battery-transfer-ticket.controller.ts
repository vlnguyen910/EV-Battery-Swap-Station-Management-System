import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BatteryTransferTicketService } from './battery-transfer-ticket.service';
import { CreateBatteryTransferTicketDto } from './dto/create-battery-transfer-ticket.dto';
import { UpdateBatteryTransferTicketDto } from './dto/update-battery-transfer-ticket.dto';
import { findBatteryAvailibleForTransfers } from './dto/get-availibale-batteries-transfer.dto';

@Controller('battery-transfer-ticket')
export class BatteryTransferTicketController {
  constructor(private readonly batteryTransferTicketService: BatteryTransferTicketService) { }

  @Post()
  create(@Body() createBatteryTransferTicketDto: CreateBatteryTransferTicketDto) {
    return this.batteryTransferTicketService.create(createBatteryTransferTicketDto);
  }

  @Get()
  findAll() {
    return this.batteryTransferTicketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.batteryTransferTicketService.findOne(id);
  }

  @Get('station/:id')
  findOneByStation(@Param('id', ParseIntPipe) id: number) {
    return this.batteryTransferTicketService.findBatteryTicketByStation(id);
  }


  @Post('available-batteries')
  findAvailableBatteries(@Body() dto: findBatteryAvailibleForTransfers) {
    return this.batteryTransferTicketService.getAvailableBatteriesForTransfer(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBatteryTransferTicketDto: UpdateBatteryTransferTicketDto) {
    return this.batteryTransferTicketService.update(+id, updateBatteryTransferTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batteryTransferTicketService.remove(+id);
  }
}
