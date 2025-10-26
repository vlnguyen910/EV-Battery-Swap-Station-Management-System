import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator';

export class AssignVehicleDto {
    @IsNotEmpty()
    @IsString()
    @Length(18, 18, { message: 'VIN must be exactly 18 characters' })
    vin: string;

    @IsNotEmpty()
    @IsInt()
    user_id: number;
}