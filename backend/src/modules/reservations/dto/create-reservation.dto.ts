import { IsNotEmpty, IsInt, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ReservationStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsInt({ message: 'User ID must be an integer' })
  @Type(() => Number)
  user_id: number;

  @IsNotEmpty({ message: 'Station ID is required' })
  @IsInt({ message: 'Station ID must be an integer' })
  @Type(() => Number)
  station_id: number;

  @IsInt({ message: 'Battery ID must be an integer' })
  @Type(() => Number)
  battery_id: number;

  @IsNotEmpty({ message: 'Scheduled time is required' })
  @IsDateString({}, { message: 'Scheduled time must be a valid date' })
  scheduled_time: string;

  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(ReservationStatus, { message: 'Status must be one of the following: scheduled, completed, cancelled' })
  status: ReservationStatus;
}

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @IsOptional()
  @IsEnum(ReservationStatus, { message: 'Invalid reservation status' })
  status?: ReservationStatus;
}
