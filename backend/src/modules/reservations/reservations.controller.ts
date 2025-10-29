import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { $Enums, ReservationStatus } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reservations')
@UseGuards(AuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Roles($Enums.Role.driver)
  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Roles($Enums.Role.driver)
  @Get('/user/:id')
  findAllByUserId(@Param('id', ParseIntPipe) userId: number) {
    return this.reservationsService.findManyByUserId(userId);
  }

  @Roles($Enums.Role.station_staff)
  @Get('/station/:id')
  findAllByStationId(@Param('id', ParseIntPipe) stationId: number) {
    return this.reservationsService.findManyScheduledByStationId(stationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.findOne(+id);
  }


  @Patch(':id')
  updateStatus(@Param('id', ParseIntPipe) id: number,
    @Body() input: {
      user_id: number,
      status: ReservationStatus
    }) {
    return this.reservationsService.updateReservationStatus(id, input.user_id, input.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }
}
