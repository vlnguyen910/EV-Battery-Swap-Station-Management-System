import { IsEnum, IsNotEmpty } from 'class-validator';
import { StationStatus } from '@prisma/client';

export class UpdateStationStatusDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(StationStatus, { 
    message: 'Status must be one of: active, inactive, maintenance' 
  })
  status: StationStatus;
}