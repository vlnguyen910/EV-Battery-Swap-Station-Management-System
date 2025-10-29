import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SupportsService } from './supports.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { SupportStatus } from '@prisma/client';

@Controller('supports')
export class SupportsController {
  constructor(private readonly supportsService: SupportsService) {}

  @Post()
  create(@Body() createSupportDto: CreateSupportDto) {
    return this.supportsService.create(createSupportDto);
  }

  @Get()
  findAll() {
    return this.supportsService.findAll();
  }

  @Get('statistics')
  getStatistics() {
    return this.supportsService.getStatistics();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.supportsService.findByUser(+userId);
  }

  @Get('station/:stationId')
  findByStation(@Param('stationId') stationId: string) {
    return this.supportsService.findByStation(+stationId);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: SupportStatus) {
    return this.supportsService.findByStatus(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupportDto: UpdateSupportDto) {
    return this.supportsService.update(+id, updateSupportDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: SupportStatus) {
    return this.supportsService.updateStatus(+id, status);
  }

  @Patch(':id/rating')
  addRating(@Param('id') id: string, @Body('rating') rating: number) {
    return this.supportsService.addRating(+id, rating);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supportsService.remove(+id);
  }
}

