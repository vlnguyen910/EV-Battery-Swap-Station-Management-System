import {
    IsNotEmpty,
    IsString,
    IsNumber,
    Min,
    Max,
    IsOptional,
    IsEnum,
    MinLength,
    MaxLength,
    IsPositive
} from "class-validator";
import { Type } from 'class-transformer';

export class CreateBatteryDto {
    @IsNotEmpty({ message: 'Model is required' })
    @IsString({ message: 'Model must be a string' })
    @MinLength(2, { message: 'Model must be at least 2 characters long' })
    model: string;

    @IsNotEmpty({ message: 'Type is required' })
    @IsString({ message: 'Type must be a string' })
    @MinLength(2, { message: 'Type must be at least 2 characters long' })
    @MaxLength(50, { message: 'Type must be at most 50 characters long' })
    type: string;

    @IsNotEmpty({ message: 'Capacity is required' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Capacity must be a number with max 2 decimal places' })
    @Type(() => Number)
    @Min(1, { message: 'Capacity must be at least 1 kWh' })
    capacity_kwh: number;

    @IsNotEmpty({ message: 'Current charge is required' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Current charge must be a number with max 2 decimal places' })
    @Type(() => Number)
    @Min(0, { message: 'Current charge cannot be negative' })
    @Max(100, { message: 'Current charge cannot exceed 100%' })
    current_charge: number;

    @IsNotEmpty({ message: 'State of health is required' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'SOH must be a number with max 2 decimal places' })
    @Type(() => Number)
    @Min(0, { message: 'SOH cannot be negative' })
    @Max(100, { message: 'SOH cannot exceed 100%' })
    soh: number;
}
