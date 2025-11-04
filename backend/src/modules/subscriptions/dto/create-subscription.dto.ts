import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateSubscriptionDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  package_id: number;

  @IsNotEmpty()
  @IsInt()
  vehicle_id: number;
}

