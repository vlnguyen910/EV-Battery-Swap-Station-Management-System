import { Controller, Post, Body } from '@nestjs/common';
import { SwappingService } from './swapping.service';
import { SwappingDto } from './dto/swapping.dto';
import { FirstSwapDto } from './dto/first-swap.dto';

@Controller('swapping')
export class SwappingController {
  constructor(private readonly swappingService: SwappingService) { }

  @Post('automatic-swap')
  async swapBatteries(@Body() swapDto: SwappingDto) {
    return this.swappingService.swapBatteries(swapDto);
  }

  @Post('initialize-battery')
  async initializeBattery(@Body() firstSwapDto: FirstSwapDto) {
    return this.swappingService.initializeBattery(firstSwapDto);
  }
}
