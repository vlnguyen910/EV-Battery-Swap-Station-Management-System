import { IsString, IsNumber, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export enum ConfigTypeEnum {
  DEPOSIT = 'deposit',
  PENALTY = 'penalty',
  SERVICE_FEE = 'service_fee',
  SWAP_FEE = 'swap_fee',
  LATE_FEE = 'late_fee',
  DAMAGE_FEE = 'damage_fee',
  OTHER = 'other',
}

export class CreateConfigDto {
  @IsEnum(ConfigTypeEnum)
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsOptional()
  description?: string;
}
