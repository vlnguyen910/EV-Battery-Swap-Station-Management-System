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
import { ApiProperty } from "@nestjs/swagger";

export class CreateBatteryDto {
    @ApiProperty({ description: 'Battery model name', example: 'Model X' })
    @IsNotEmpty({ message: 'Model is required' })
    @IsString({ message: 'Model must be a string' })
    @MinLength(2, { message: 'Model must be at least 2 characters long' })
    model: string;

    @ApiProperty({ description: 'Battery type', example: 'Li-Ion' })
    @IsNotEmpty({ message: 'Type is required' })
    @IsString({ message: 'Type must be a string' })
    @MinLength(2, { message: 'Type must be at least 2 characters long' })
    @MaxLength(50, { message: 'Type must be at most 50 characters long' })
    type: string;

    @ApiProperty({ description: 'Battery capacity in kWh', example: 75.5 })
    @IsNotEmpty({ message: 'Capacity is required' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Capacity must be a number with max 2 decimal places' })
    @Type(() => Number)
    @Min(1, { message: 'Capacity must be at least 1 kWh' })
    capacity_kwh: number;

    @ApiProperty({ description: 'Current charge percentage', example: 85.5 })
    @IsNotEmpty({ message: 'Current charge is required' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Current charge must be a number with max 2 decimal places' })
    @Type(() => Number)
    @Min(0, { message: 'Current charge cannot be negative' })
    @Max(100, { message: 'Current charge cannot exceed 100%' })
    current_charge: number;

    @ApiProperty({ description: 'State of health percentage', example: 90.0 })
    @IsNotEmpty({ message: 'State of health is required' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'SOH must be a number with max 2 decimal places' })
    @Type(() => Number)
    @Min(0, { message: 'SOH cannot be negative' })
    @Max(100, { message: 'SOH cannot exceed 100%' })
    soh: number;
}
