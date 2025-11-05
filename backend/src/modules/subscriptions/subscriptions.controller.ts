import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req
} from '@nestjs/common';
import type { Request } from 'express';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('subscriptions')
@UseGuards(AuthGuard, RolesGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) { }

  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  // StatusCode = 200 do ko tạo mới
  @HttpCode(HttpStatus.OK)
  @Post('expire-subscriptions')
  @Roles('admin')
  expireSubscriptions() {
    return this.subscriptionsService.updateExpiredSubscriptions();
  }

  @Get()
  @Roles('admin', 'station_staff')
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Get(':id')
  @Roles('driver', 'admin', 'station_staff')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    // Extract user info from JWT token (attached by AuthGuard)
    const user = req['user'];
    return this.subscriptionsService.findOne(id, user);
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.subscriptionsService.findByUser(userId);
  }

  @Get('user/:userId/active')
  findActiveByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.subscriptionsService.findActiveByUser(userId);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, updateSubscriptionDto);
  }

  @Patch(':id/cancel')
  @Roles('driver', 'admin')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionsService.cancel(id);
  }

  @Patch(':id/increment-swap')
  @Roles('station_staff', 'admin')
  incrementSwapUsed(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionsService.incrementSwapUsed(id);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionsService.remove(id);
  }
}
