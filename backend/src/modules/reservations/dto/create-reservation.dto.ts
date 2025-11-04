import { IsNotEmpty, IsInt, IsEnum, IsOptional, IsDate } from 'class-validator';
import { ReservationStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsInt({ message: 'User ID must be an integer' })
  user_id: number;

  @IsNotEmpty()
  @IsInt()
  vehicle_id: number;

  @IsNotEmpty({ message: 'Station ID is required' })
  @IsInt({ message: 'Station ID must be an integer' })
  station_id: number;

  @IsNotEmpty({ message: 'Scheduled time is required' })
  @IsDate({ message: 'Scheduled time must be a valid date' })
  @Type(() => Date)
  scheduled_time: Date;
}
