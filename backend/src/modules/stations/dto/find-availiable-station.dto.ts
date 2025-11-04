import { IsDecimal, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/library";
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
}