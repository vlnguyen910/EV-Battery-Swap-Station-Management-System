import { IsNumber, IsInt, IsNotEmpty, IsOptional, Min, Max, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class findAvailibaleStationsDto {
    @ApiProperty({ example: '1', description: 'User to find stations' })
    @IsNotEmpty()
    @IsInt()
    user_id: number;

    @ApiProperty({ example: '1', description: '' })
    @IsOptional()
    @IsInt()
    vehicle_id?: number;

    @ApiProperty({ example: '10.762622', description: 'Latitude of the user location' })
    @IsOptional()
    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude?: number;

    @ApiProperty({ example: '106.660172', description: 'Longitude of the user location' })
    @IsOptional()
    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude?: number;
}