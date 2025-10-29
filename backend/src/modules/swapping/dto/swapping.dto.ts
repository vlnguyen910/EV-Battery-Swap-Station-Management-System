import { IsInt, IsNotEmpty } from "class-validator";

export class SwappingDto {
    @IsInt({ message: 'user_id must be an integer' })
    @IsNotEmpty({ message: 'user_id is required' })
    user_id: number;

    @IsInt({ message: 'station_id must be an integer' })
    @IsNotEmpty({ message: 'station_id is required' })
    station_id: number;
}

