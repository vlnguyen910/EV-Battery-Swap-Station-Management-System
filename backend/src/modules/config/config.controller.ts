import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createConfigDto: CreateConfigDto) {
    return await this.configService.create(createConfigDto);
  }

  @Get()
  async findAll(
    @Query('type') type?: string,
    @Query('activeOnly') activeOnly: boolean = true,
  ) {
    return await this.configService.findAll(type, activeOnly);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.configService.findOne(parseInt(id));
  }

  @Get('by-name/:name')
  async findByName(@Param('name') name: string) {
    return await this.configService.findByName(name);
  }

  @Get('value/:name')
  async getConfigValue(@Param('name') name: string) {
    const value = await this.configService.getConfigValue(name);
    return { name, value };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateConfigDto: UpdateConfigDto) {
    return await this.configService.update(parseInt(id), updateConfigDto);
  }

  @Patch(':id/toggle')
  async toggleActive(@Param('id') id: string) {
    return await this.configService.toggleActive(parseInt(id));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.configService.remove(parseInt(id));
  }
}
