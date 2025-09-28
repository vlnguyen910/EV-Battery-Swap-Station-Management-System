import { PartialType } from '@nestjs/mapped-types';
import { CreateChangingStationDto } from './create-changing-station.dto';

export class UpdateChangingStationDto extends PartialType(CreateChangingStationDto) {}
