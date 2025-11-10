import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BatteriesService } from './batteries.service';
import { CreateBatteryDto } from './dto/create-battery.dto';
import { UpdateBatteryDto } from './dto/update-battery.dto';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { $Enums } from '.prisma/client';

@UseGuards(AuthGuard, RolesGuard, EmailVerifiedGuard)
@ApiBearerAuth('access-token')
@ApiTags('batteries')
@Controller('batteries')
export class BatteriesController {
  constructor(private readonly batteriesService: BatteriesService) { }

  @Roles($Enums.Role.admin)
  @ApiOperation({ summary: 'Create a new battery' })
  @ApiResponse({ status: 201, description: 'The battery has been successfully created.' })
  @Post()
  create(@Body() createBatteryDto: CreateBatteryDto) {
    return this.batteriesService.create(createBatteryDto);
  }

  @Roles($Enums.Role.admin, $Enums.Role.station_staff)
  @Get()
  @ApiOperation({ summary: 'Retrieve all batteries' })
  @ApiResponse({ status: 200, description: 'List of batteries.' })
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

  @Roles($Enums.Role.admin, $Enums.Role.station_staff)
  @Get('station/:station_id')
  @ApiOperation({ summary: 'Retrieve all batteries by station ID' })
  @ApiResponse({ status: 200, description: 'List of batteries for the specified station.' })
  findByStation(@Param('station_id') station_id: string) {
    return this.batteriesService.findAllByStationId(+station_id);
  }

  @ApiOperation({ summary: 'Retrieve a battery by ID' })
  @ApiResponse({ status: 200, description: 'The battery details.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.batteriesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batteriesService.remove(+id);
  }
}
