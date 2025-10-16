import { IsInt, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class MockPaymentDto {
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
  vnp_response_code?: string; // '00' for success, '24' for cancelled, etc.

  @IsString()
  @IsOptional()
  vnp_bank_code?: string;

  @IsString()
  @IsOptional()
  vnp_card_type?: string;
}
