import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseIntPipe,
  ParseFloatPipe,
  UseGuards 
} from '@nestjs/common';
import { ChangingStationsService } from './changing-stations.service';
import { CreateChangingStationDto } from './dto/create-changing-station.dto';
import { UpdateChangingStationDto } from './dto/update-changing-station.dto';
import { UpdateStationStatusDto } from './dto/update-station-status.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { StationStatus } from '@prisma/client';

@Controller('changing-stations')
@UseGuards(AuthGuard, RolesGuard)
export class ChangingStationsController {
  constructor(private readonly changingStationsService: ChangingStationsService) {}

  @Post()
  @Roles('admin')
  create(@Body() createChangingStationDto: CreateChangingStationDto) {
    return this.changingStationsService.create(createChangingStationDto);
  }

  @Get()
  findAll(@Query('status') status?: StationStatus) {
    return this.changingStationsService.findAll(status);
  }

  @Get('active')
  findActive() {
    return this.changingStationsService.findActiveStations();
  }

  @Get('search')
  findByName(@Query('name') name: string) {
    return this.changingStationsService.findByName(name);
  }

  @Get('nearby')
  findNearby(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('radius') radius?: string,
  ) {
    const radiusKm = radius ? parseFloat(radius) : 10;
    return this.changingStationsService.findByLocation(latitude, longitude, radiusKm);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.changingStationsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateChangingStationDto: UpdateChangingStationDto
  ) {
    return this.changingStationsService.update(id, updateChangingStationDto);
  }

  @Patch(':id/status')
  @Roles('admin' , 'station_staff')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStationStatusDto,
  ) {
    return this.changingStationsService.updateStatus(id, updateStatusDto.status);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.changingStationsService.remove(id);
  }
}
