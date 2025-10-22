import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { SupportType } from '@prisma/client';

export class CreateSupportDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsOptional()
  station_id?: number;

  @IsEnum(SupportType)
  @IsNotEmpty()
  type: SupportType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;
}

