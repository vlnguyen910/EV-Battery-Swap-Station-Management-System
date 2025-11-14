import { IsInt, IsNotEmpty } from "class-validator";
import { ReturnBatteryDto } from "./return-battery.dto";

export class TakeBatteryDto extends ReturnBatteryDto {
    @IsNotEmpty()
    @IsInt()
    taken_battery_id: number
}