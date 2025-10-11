import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { ReservationStatus } from '@prisma/client';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
    @IsNotEmpty({ message: 'Reservation status is required' })
    @IsEnum(ReservationStatus, { message: 'Status must be one of the following: scheduled, completed, cancelled' })
    status: ReservationStatus;
}
