import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ConfigService } from './config.service';
import { SystemConfigService } from './system-config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('config')
export class ConfigController {
  constructor(
    private readonly configService: ConfigService,
    private readonly systemConfigService: SystemConfigService,
  ) {}

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

  /**
   * ⭐ SYSTEM CONFIG ENDPOINTS
   */

  /**
   * Get all system configs (from memory cache)
   * GET /config/system/all
   */
  @Get('system/all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  getAllSystemConfigs() {
    const configs = this.systemConfigService.getAll();
    return {
      success: true,
      data: configs,
      note: 'Configs are loaded once at server startup. Restart server to apply changes.',
    };
  }

  /**
   * Get specific system config value (from memory)
   * GET /config/system/:key
   */
  @Get('system/:key')
  getSystemConfig(@Param('key') key: string) {
    const value = this.systemConfigService.get(key);
    return {
      key,
      value,
      exists: this.systemConfigService.has(key),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.configService.remove(parseInt(id));
  }
}
