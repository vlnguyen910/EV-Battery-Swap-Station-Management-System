import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSubscriptionDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  package_id: number;

  @IsInt()
  @IsOptional()
  vehicle_id?: number;
}

