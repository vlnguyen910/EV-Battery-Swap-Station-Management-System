import {
    IsNotEmpty,
    IsString,
    IsNumber,
    Min,
    Max,
    MinLength,
    MaxLength,
    IsOptional,
    IsEnum,
} from "class-validator";
import { Type } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";
import { Battery, BatteryStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class CreateBatteryDto {
    @ApiProperty({ description: 'ID of the station where the battery is located', example: 1 })
    @IsNotEmpty({ message: 'station_id is required' })
    @IsNumber({}, { message: 'station_id must be a number' })
    station_id: number;

    @ApiProperty({ description: 'Battery model name', example: 'Model X' })
    @IsOptional()
    @IsString({ message: 'Model must be a string' })
    @MinLength(2, { message: 'Model must be at least 2 characters long' })
    model: string = 'EV Model 1';

    @ApiProperty({ description: 'Battery type', example: 'Li-Ion' })
    @IsOptional()
    @IsString({ message: 'Type must be a string' })
    @MinLength(2, { message: 'Type must be at most 50 characters long' })
    @MaxLength(50, { message: 'Type must be at most 50 characters long' })
    type: string = "Lithium-ion";

    @ApiProperty({ description: 'Battery capacity in kWh', example: 75.5 })
    @IsNotEmpty({ message: 'capacity is required' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'capacity must be a number with max 2 decimal places' })
    @Type(() => Decimal)
    @Min(1, { message: 'capacity must be at least 1 kWh' })
    capacity: number;

    @ApiProperty({ description: 'Current charge percentage', example: 85.5 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'current_charge must be a number with max 2 decimal places' })
    @Type(() => Number)
    @Min(0, { message: 'Current charge cannot be negative' })
    @Max(100, { message: 'Current charge cannot exceed 100%' })
    current_charge: number = 100;

    @ApiProperty({ description: 'State of health percentage', example: 90.0 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'SOH must be a number with max 2 decimal places' })
    @Type(() => Number)
    @Min(0, { message: 'SOH cannot be negative' })
    @Max(100, { message: 'SOH cannot exceed 100%' })
    soh: number = 100;

    @ApiProperty({ description: 'Battery status', example: 'full', enum: BatteryStatus })
    @IsOptional()
    @IsEnum(BatteryStatus, { message: 'status must be a valid BatteryStatus enum value' })
    status: BatteryStatus = BatteryStatus.full;
};
