import { StationStatus } from "@prisma/client";
import { IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min } from "class-validator";
import { Decimal } from "generated/prisma/runtime/library";

export class CreateStationDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MaxLength(100)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    address: string;

    @IsNotEmpty()
    @IsDecimal({ decimal_digits: '1,8' })
    @Min(-90)
    @Max(90)
    latitude: string;

    @IsNotEmpty()
    @IsDecimal({ decimal_digits: '1,8' })
    @Min(-180)
    @Max(180)
    longitude: string;

    @IsNotEmpty({ message: 'Status is required' })
    @IsEnum(StationStatus, { message: 'Status must be active, inactive, or maintenance  ' })
    status: StationStatus;
}
