import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, ParseFloatPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { $Enums, StationStatus } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { UseGuards as UserGuards } from '@nestjs/common';
import { findAvailibaleStationsDto } from './dto/find-availiable-station.dto'

@Controller('stations')
@UserGuards(AuthGuard, RolesGuard)
export class StationsController {
  constructor(private readonly stationsService: StationsService) { }

  @Post()
  @Roles($Enums.Role.admin, $Enums.Role.station_staff)
  create(@Body() createStationDto: CreateStationDto) {
    return this.stationsService.create(createStationDto);
  }

  @Get()
  findAll(@Query('status') status?: StationStatus) {
    return this.stationsService.findAll(status);
  }

  @Get('active')
  findActive() {
    return this.stationsService.findActiveStations();
  }

  @Get('search')
  findByName(@Query('name') name: string) {
    return this.stationsService.findByName(name);
  }

  @HttpCode(HttpStatus.OK)
  @Roles($Enums.Role.driver)
  @Post('available')
  async findAllAvailable(
    @Body() dto: findAvailibaleStationsDto,
  ) {
    return this.stationsService.findAllAvailable(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stationsService.findOne(id);
  }

  @Patch(':id')
  @Roles($Enums.Role.admin, $Enums.Role.station_staff)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateStationDto: UpdateStationDto) {
    return this.stationsService.update(id, updateStationDto);
  }

  @Delete(':id')
  @Roles($Enums.Role.admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.stationsService.remove(id);
  }
}
