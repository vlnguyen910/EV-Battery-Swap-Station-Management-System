import { BatteryStatus } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, Min } from "class-validator";

export class findBatteryAvailibleForTicket {
    @IsNotEmpty()
    @IsString()
    model: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsInt()
    station_id: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity: number;

    @IsNotEmpty()
    @IsEnum(BatteryStatus)
    status: BatteryStatus;
}