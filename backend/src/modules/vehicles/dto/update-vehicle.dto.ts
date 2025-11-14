import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-vehicle.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
    @IsOptional()
    @IsInt()
    battery_id?: number | null;
}
