import { ApiProperty } from "@nestjs/swagger";
import { StationStatus } from "@prisma/client";
import { IsDecimal, IsEnum, IsNotEmpty, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateStationDto {
    @ApiProperty({ description: 'Name of the station', maxLength: 100, example: 'Downtown EV Station' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MaxLength(100)
    name: string;

    @ApiProperty({ description: 'Address of the station', maxLength: 255, example: '123 Main St, Cityville' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    address: string;

    @ApiProperty({ description: 'Latitude of the station', example: '37.7749' })
    @IsNotEmpty()
    @IsDecimal({ decimal_digits: '1,8' })
    @Min(-90)
    @Max(90)
    latitude: string;

    @ApiProperty({ description: 'Longitude of the station', example: '-122.4194' })
    @IsNotEmpty()
    @IsDecimal({ decimal_digits: '1,9' })
    @Min(-180)
    @Max(180)
    longitude: string;

    @ApiProperty({ description: 'Status of the station', example: 'active', enum: StationStatus })
    @IsNotEmpty({ message: 'Status is required' })
    @IsEnum(StationStatus, { message: 'Status must be active, inactive, or maintenance  ' })
    status: StationStatus;
}
