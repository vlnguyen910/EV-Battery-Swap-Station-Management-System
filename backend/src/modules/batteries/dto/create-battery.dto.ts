import {
    IsNotEmpty,
    IsString,
    IsNumber,
    Min,
    MinLength,
    MaxLength,
    IsEnum,
} from "class-validator";
import { Type } from 'class-transformer';
import { BatteryStatus } from "@prisma/client";

export class CreateBatteryDto {
    @IsNotEmpty({ message: 'Serial number is required' })
    @IsString({ message: 'Serial number must be a string' })
    @MinLength(12, { message: 'Serial number must be at least 2 characters long' })
    serial_number: string;

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

    @IsNotEmpty({ message: 'Status is required' })
    @IsEnum(BatteryStatus, { message: 'Status must be a valid BatteryStatus enum value' })
    status: BatteryStatus;

    current_charge?: number; // Optional, defaults to 0
    soh?: number; // Optional, defaults to 100
    vehicle_id?: number | null; // Optional, can be null if not assigned to a vehicle
    station_id?: number | null; // Optional, can be null if not assigned to a station
    cabinet_id?: number | null; // Optional, can be null if not assigned to a cabinet
    slot_id?: number | null; // Optional, can be null if not assigned to a slot
}
