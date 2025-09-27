import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StationStatus } from '@prisma/client';

export class CreateChangingStationDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @MaxLength(500, { message: 'Address must not exceed 500 characters' })
  address?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Latitude must be a number' })
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Longitude must be a number' })
  @Type(() => Number)
  longitude?: number;

  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(StationStatus, { message: 'Status must be active, inactive, or maintenance' })
  status: StationStatus;
}
