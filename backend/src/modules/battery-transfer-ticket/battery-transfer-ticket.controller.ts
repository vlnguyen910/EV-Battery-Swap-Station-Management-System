import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BatteryTransferTicketService } from './battery-transfer-ticket.service';
import { CreateBatteryTransferTicketDto } from './dto/create-battery-transfer-ticket.dto';
import { UpdateBatteryTransferTicketDto } from './dto/update-battery-transfer-ticket.dto';

@Controller('battery-transfer-ticket')
export class BatteryTransferTicketController {
  constructor(private readonly batteryTransferTicketService: BatteryTransferTicketService) {}

  @Post()
  create(@Body() createBatteryTransferTicketDto: CreateBatteryTransferTicketDto) {
    return this.batteryTransferTicketService.create(createBatteryTransferTicketDto);
  }

  @Get()
  findAll() {
    return this.batteryTransferTicketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.batteryTransferTicketService.findOne(+id);
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
