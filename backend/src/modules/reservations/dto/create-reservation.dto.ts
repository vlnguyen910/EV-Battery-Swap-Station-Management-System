import { IsNotEmpty, IsInt, IsEnum, IsOptional, IsDate } from 'class-validator';
import { ReservationStatus } from '@prisma/client';
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

  @IsOptional()
  @IsInt({ message: 'Battery ID must be an integer' })
  @Type(() => Number)
  battery_id: number;

  @IsNotEmpty({ message: 'Station ID is required' })
  @IsInt({ message: 'Station ID must be an integer' })
  @Type(() => Number)
  station_id: number;
  
  @IsNotEmpty({ message: 'Scheduled time is required' })
  @IsDate({ message: 'Scheduled time must be a valid date' })
  @Type(() => Date)
  scheduled_time: Date;

  @IsOptional()
  @IsEnum(ReservationStatus, { message: 'Status must be one of the following: scheduled, completed, cancelled' })
  status: ReservationStatus;
}
