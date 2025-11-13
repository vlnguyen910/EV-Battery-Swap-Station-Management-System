import {
    IsNotEmpty,
    IsString,
    IsNumber,
    Min,
    MinLength,
    MaxLength,
    IsEnum,
    Max,
    IsOptional,
    IsInt,
} from "class-validator";
import { Type } from 'class-transformer';
import { BatteryStatus } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class CreateBatteryDto {
    @IsNotEmpty({ message: 'Serial number is required' })
    @IsString({ message: 'Serial number must be a string' })
    @MinLength(12, { message: 'Serial number must be at least 2 characters long' })
    serial_number: string;

    @IsOptional()
    @IsInt()
    vehicle_id?: number | null; // Optional, can be null if not assigned to a vehicle

    @IsOptional()
    @IsInt()
    station_id?: number | null; // Optional, can be null if not assigned to a station

    @IsOptional()
    @IsInt()
    cabinet_id?: number | null; // Optional, can be null if not assigned to a cabinet

    @IsOptional()
    @IsInt()
    slot_id?: number | null; // Optional, can be null if not assigned to a slot

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
    capacity_kwh: number = 30.0;

    @ApiProperty({ description: 'Current charge percentage', example: 85.5 })
    @IsNotEmpty({ message: 'Current charge is required' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Current charge must be a number with max 2 decimal places' })
    @Type(() => Number)
    @Min(0, { message: 'Current charge cannot be negative' })
    @Max(100, { message: 'Current charge cannot exceed 100%' })
    current_charge: number = 100;

    @ApiProperty({ description: 'State of health percentage', example: 90.0 })
    @IsNotEmpty({ message: 'State of health is required' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'SOH must be a number with max 2 decimal places' })
    @Type(() => Number)
    @Min(0, { message: 'SOH cannot be negative' })
    @Max(100, { message: 'SOH cannot exceed 100%' })
    soh: number = 100;

    @IsNotEmpty({ message: 'Status is required' })
    @IsEnum(BatteryStatus, { message: 'Status must be a valid BatteryStatus enum value' })
    status: BatteryStatus;
}
