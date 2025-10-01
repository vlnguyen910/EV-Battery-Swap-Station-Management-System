import { IsNotEmpty, IsInt, IsDateString } from 'class-validator';
import {ReservationStatus} from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsInt({ message: 'User ID must be an integer' })
  @Type(() => Number)
  user_id: number;

  @IsNotEmpty({ message: 'Vehicle ID is required' })
  @IsInt({ message: 'Vehicle ID must be an integer' })
  @Type(() => Number)
  vehicle_id: number;

  @IsInt({ message: 'Battery ID must be an integer' })
  @Type(() => Number)
  battery_id: number;

    @IsNotEmpty({ message: 'Station ID is required' })
  @IsInt({ message: 'Station ID must be an integer' })
  @Type(() => Number)
  station_id: number;

  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(ReservationStatus, { message: 'Status must be one of the following: scheduled, completed, cancelled' })
  status: ReservationStatus;
}
