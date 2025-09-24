import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  MaxLength,
} from 'class-validator';

export class CreateVehicleDto {
    @IsOptional()
    @IsInt({ message: 'User ID must be a number' })
    user_id?: number;

    @IsOptional()
    @IsInt({ message: 'Battery ID must be a number' })
    battery_id?: number;

    @IsNotEmpty({ message: 'VIN is required' })
    @IsString({ message: 'VIN must be a string' })
    @MaxLength(50, { message: 'VIN must not exceed 50 characters' })
    vin: string;

    @IsOptional()
    @IsString({ message: 'Battery model must be a string' })
    @MaxLength(50, { message: 'Battery model must not exceed 50 characters' })
    battery_model?: string;

    @IsOptional()
    @IsString({ message: 'Battery type must be a string' })
    @MaxLength(50, { message: 'Battery type must not exceed 50 characters' })
    battery_type?: string;
}
