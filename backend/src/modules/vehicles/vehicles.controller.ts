import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { $Enums } from '@prisma/client';
import { AssignVehicleDto } from './dto/assign-vehicle.dto';
import { AddVehicleDto } from './dto/add-vehicle.dto';

@Controller('vehicles')
@UseGuards(AuthGuard, RolesGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) { }

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get('/user/:id')
  findAll(@Param('id', ParseIntPipe) userId: number) {
    return this.vehiclesService.findManyByUser(userId);
  }

  @Get('vin/:vin')
  findByVin(@Param('vin') vin: string) {
    return this.vehiclesService.findByVin(vin);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.findOne(id);
  }

  @Patch('add-vehicle')
  @Roles($Enums.Role.driver) // ✅ FIXED: Only drivers can own vehicles (removed admin)
  addVehicleToCurrentUser(
    @Body() addVehicleDto: AddVehicleDto,
    @Req() req: Request,
  ) {
    // Get user_id from JWT token (attached by AuthGuard)
    const user = req['user'] as any;

    // Validate that user info exists
    if (!user || !user.sub) {
      throw new UnauthorizedException('User information not found in token');
    }

    return this.vehiclesService.assignVehicleToUser({
      vin: addVehicleDto.vin,
      user_id: user.sub, // user.sub contains the user_id from JWT payload
    });
  }

  @Patch('assign-vehicle')
  @Roles($Enums.Role.admin)
  assignVehicleToUser(
    @Body() assignVehicleDto: AssignVehicleDto,
  ) {
    return this.vehiclesService.assignVehicleToUser(assignVehicleDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.remove(id);
  }
}
