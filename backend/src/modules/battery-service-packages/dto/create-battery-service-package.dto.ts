import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsBoolean,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateBatteryServicePackageDto {
  @IsNotEmpty({ message: 'Package name is required' })
  @IsString({ message: 'Package name must be a string' })
  @MaxLength(100, { message: 'Package name must not exceed 100 characters' })
  name: string;

  @IsNotEmpty({ message: 'Base distance is required' })
  @IsInt({ message: 'Base distance must be an integer' })
  @Min(0, { message: 'Base distance must be non-negative' })
  @Type(() => Number)
  base_distance: number;

  @IsNotEmpty({ message: 'Base price is required' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Base price must be a valid number with up to 2 decimal places' })
  @Min(0, { message: 'Base price must be non-negative' })
  @Type(() => Number)
  base_price: number;

  @IsNotEmpty({ message: 'Swap count is required' })
  @IsInt({ message: 'Swap count must be an integer' })
  @Min(0, { message: 'Swap count must be non-negative' })
  @Type(() => Number)
  swap_count: number;

  @IsNotEmpty({ message: 'Penalty fee is required' })
  @IsInt({ message: 'Penalty fee must be an integer' })
  @Min(0, { message: 'Penalty fee must be non-negative' })
  @Type(() => Number)
  penalty_fee: number;

  @IsNotEmpty({ message: 'Duration days is required' })
  @IsInt({ message: 'Duration days must be an integer' })
  @Min(1, { message: 'Duration days must be at least 1' })
  @Type(() => Number)
  duration_days: number;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(255, { message: 'Description must not exceed 255 characters' })
  description?: string;

  @IsNotEmpty({ message: 'Active status is required' })
  @IsBoolean({ message: 'Active must be a boolean' })
  @Type(() => Boolean)
  active: boolean;
}
