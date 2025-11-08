import { IsNumber, IsInt, IsNotEmpty, IsOptional, Min, Max, IsString, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

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
    @Type(() => Number)
    latitude?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    longitude?: number;
}