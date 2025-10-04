import { StationStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateStationDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsNotEmpty({ message: 'Address is required' })
    @IsString({ message: 'Address must be a string' })
    address: string;

    @IsNumber({}, { message: 'Latitude must be a number' })
    @IsNotEmpty({ message: 'Latitude is required' })
    latitude: number;

    @IsNumber({}, { message: 'Longitude must be a number' })
    @IsNotEmpty({ message: 'Longitude is required' })
    longitude: number;

    @IsNotEmpty({ message: 'Status is required' })
    @IsEnum(StationStatus, { message: 'Status must be active, inactive, or maintenance  ' })
    status: StationStatus;
}
