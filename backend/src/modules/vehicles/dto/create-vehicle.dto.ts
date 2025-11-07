import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VehicleStatus } from '@prisma/client';

export class CreateVehicleDto {

  @IsNotEmpty({ message: 'VIN is required' })
  @IsString({ message: 'VIN must be a string' })
  @MaxLength(50, { message: 'VIN must not exceed 50 characters' })
  vin: string;

  @IsNotEmpty({ message: 'Battery model is required' })
  @IsString({ message: 'Battery model must be a string' })
  @MaxLength(50, { message: 'Battery model must not exceed 50 characters' })
  battery_model: string;

  @IsNotEmpty({ message: 'Battery type is required' })
  @IsString({ message: 'Battery type must be a string' })
  @MaxLength(50, { message: 'Battery type must not exceed 50 characters' })
  battery_type: string;

}
