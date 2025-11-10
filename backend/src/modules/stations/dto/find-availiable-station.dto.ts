import { IsNumber, IsInt, IsNotEmpty, IsOptional } from "class-validator";
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

    @IsOptional()
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @IsNumber()
    longitude?: number;
}