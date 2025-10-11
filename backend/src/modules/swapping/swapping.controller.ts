import { Controller, Post, Body } from '@nestjs/common';
import { SwappingService } from './swapping.service';

@Controller('swapping')
export class SwappingController {
  constructor(private readonly swappingService: SwappingService) { }

  @Post('automatic-swap')
  async swapBatteries(@Body() input: { swapDto: any }) {
    return this.swappingService.swapBatteries(input.swapDto);
  }
}
