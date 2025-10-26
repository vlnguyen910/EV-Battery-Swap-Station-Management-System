import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BatteryTransferRequestService } from './battery-transfer-request.service';
import { CreateBatteryTransferRequestDto } from './dto/create-battery-transfer-request.dto';
import { UpdateBatteryTransferRequestDto } from './dto/update-battery-transfer-request.dto';

@Controller('battery-transfer-request')
export class BatteryTransferRequestController {
  constructor(private readonly batteryTransferRequestService: BatteryTransferRequestService) { }

  @Post()
  create(@Body() createBatteryTransferRequestDto: CreateBatteryTransferRequestDto) {
    return this.batteryTransferRequestService.create(createBatteryTransferRequestDto);
  }

  @Get()
  findAll() {
    return this.batteryTransferRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.batteryTransferRequestService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBatteryTransferRequestDto: UpdateBatteryTransferRequestDto) {
    return this.batteryTransferRequestService.update(id, updateBatteryTransferRequestDto);
  }
}
