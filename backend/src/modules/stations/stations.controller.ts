import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, ParseFloatPipe } from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { $Enums } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { UseGuards as UserGuards } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { ParseDecimalPipe } from '../../shared/pipes/parse-decimal.pipe';

@Controller('stations')
@UserGuards(AuthGuard, RolesGuard)
export class StationsController {
  constructor(private readonly stationsService: StationsService) { }

  @Post()
  create(@Body() createStationDto: CreateStationDto) {
    return this.stationsService.create(createStationDto);
  }

  @Get()
  findAll() {
    return this.stationsService.findAll();
  }

  @Roles($Enums.Role.driver)
  @Get('available')
  async findAllAvailable(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('latitude', ParseDecimalPipe) latitude: Decimal,
    @Query('longitude', ParseDecimalPipe) longitude: Decimal
  ) {
    return this.stationsService.findAllAvailable(userId, latitude, longitude);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStationDto: UpdateStationDto) {
    return this.stationsService.update(+id, updateStationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stationsService.remove(+id);
  }
}
