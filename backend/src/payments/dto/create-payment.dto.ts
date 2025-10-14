import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  package_id: number;

  @IsInt()
  @IsOptional()
  vehicle_id?: number;

  @IsString()
  @IsOptional()
  orderDescription?: string;

  @IsString()
  @IsOptional()
  language?: string; // 'vn' or 'en'
}
