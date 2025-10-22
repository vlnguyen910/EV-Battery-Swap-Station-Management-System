import { PartialType } from '@nestjs/swagger';
import { CreateSupportDto } from './create-support.dto';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { SupportStatus } from '@prisma/client';

export class UpdateSupportDto extends PartialType(CreateSupportDto) {
  @IsEnum(SupportStatus)
  @IsOptional()
  status?: SupportStatus;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;
}

