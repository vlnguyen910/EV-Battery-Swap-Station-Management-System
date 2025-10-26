import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AssignVehicleDto } from './dto/assign-vehicle.dto';

@Controller('vehicles')
@UseGuards(AuthGuard, RolesGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) { }

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @Roles('admin', 'station_staff')
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.vehiclesService.findByUser(parseInt(userId, 10));
    }
    return this.vehiclesService.findAll();
  }

  @Get('vin/:vin')
  findByVin(@Param('vin') vin: string) {
    return this.vehiclesService.findByVin(vin);
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.vehiclesService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Patch('add-vehicle')
  assignVehicleToUser(
    @Body() assignVehicleDto: AssignVehicleDto,
  ) {
    return this.vehiclesService.assignVehicleToUser(assignVehicleDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.remove(id);
  }
}
