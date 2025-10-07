import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseIntPipe,
  ParseFloatPipe, 
  UseGuards
} from '@nestjs/common';
import { BatteryServicePackagesService } from './battery-service-packages.service';
import { CreateBatteryServicePackageDto } from './dto/create-battery-service-package.dto';
import { UpdateBatteryServicePackageDto } from './dto/update-battery-service-package.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { $Enums } from '.prisma/client/default.js';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('battery-service-packages')
export class BatteryServicePackagesController {
  constructor(private readonly batteryServicePackagesService: BatteryServicePackagesService) {}

  @Roles($Enums.Role.admin)
  @Post()
  create(@Body() createBatteryServicePackageDto: CreateBatteryServicePackageDto) {
    return this.batteryServicePackagesService.create(createBatteryServicePackageDto);
  }

  @Get()
  findAll(@Query('activeOnly') activeOnly?: string) {
    const isActiveOnly = activeOnly === 'true';
    return this.batteryServicePackagesService.findAll(isActiveOnly);
  }

  @Get('active')
  findActive() {
    return this.batteryServicePackagesService.findActive();
  }

  @Get('price-range')
  getPackagesByPriceRange(
    @Query('minPrice', ParseFloatPipe) minPrice: number,
    @Query('maxPrice', ParseFloatPipe) maxPrice: number,
  ) {
    return this.batteryServicePackagesService.getPackagesByPriceRange(minPrice, maxPrice);
  }

  @Get('duration/:days')
  getPackagesByDuration(@Param('days', ParseIntPipe) durationDays: number) {
    return this.batteryServicePackagesService.getPackagesByDuration(durationDays);
  }

  @Get('name/:name')
  findByName(@Param('name') name: string) {
    return this.batteryServicePackagesService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.batteryServicePackagesService.findOne(id);
  }

  @Roles($Enums.Role.admin)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateBatteryServicePackageDto: UpdateBatteryServicePackageDto
  ) {
    return this.batteryServicePackagesService.update(id, updateBatteryServicePackageDto);
  }

  @Roles($Enums.Role.admin)
  @Patch(':id/activate')
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.batteryServicePackagesService.activate(id);
  }

  @Roles($Enums.Role.admin)
  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.batteryServicePackagesService.deactivate(id);
  }

  @Roles($Enums.Role.admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.batteryServicePackagesService.remove(id);
  }
}
