import { IsInt, IsNotEmpty } from "class-validator";

export class SwappingDto {
    @IsInt({ message: 'user_id must be an integer' })
    @IsNotEmpty({ message: 'user_id should not be empty' })
    user_id: number;

    @IsInt({ message: 'vehicle_id must be an integer' })
    @IsNotEmpty({ message: 'vehicle_id should not be empty' })
    vehicle_id: number;

    @IsInt({ message: 'station_id must be an integer' })
    @IsNotEmpty({ message: 'station_id should not be empty' })
    station_id: number;

    @IsInt({ message: 'return_battery_id must be an integer' })
    @IsNotEmpty({ message: 'return_battery_id should not be empty' })
    return_battery_id: number;
}

