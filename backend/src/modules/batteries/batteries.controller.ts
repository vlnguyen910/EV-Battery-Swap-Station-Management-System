import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BatteriesService } from './batteries.service';
import { CreateBatteryDto } from './dto/create-battery.dto';
import { UpdateBatteryDto } from './dto/update-battery.dto';

@Controller('batteries')
export class BatteriesController {
  constructor(private readonly batteriesService: BatteriesService) { }

  @Post()
  create(@Body() createBatteryDto: CreateBatteryDto) {
    return this.batteriesService.create(createBatteryDto);
  }

  @Get()
  findAll() {
    return this.batteriesService.findAll();
  }

  @Get('best')
  findBestBattery(@Body() input: {
    vehicle_id: number,
    station_id: number
  }) {
    return this.batteriesService.findBestBatteryForVehicle(input.vehicle_id, input.station_id);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.batteriesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batteriesService.remove(+id);
  }
}
