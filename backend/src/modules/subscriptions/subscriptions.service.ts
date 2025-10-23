import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { DatabaseService } from '../database/database.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: DatabaseService) { }

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    // 1. Check if package exists and is active
    const servicePackage = await this.prisma.batteryServicePackage.findUnique({
      where: { package_id: createSubscriptionDto.package_id },
    });

    if (!servicePackage) {
      throw new NotFoundException('Package not found');
    }

    if (!servicePackage.active) {
      throw new BadRequestException('Package is not active');
    }

    // 2. Check if user has an active subscription for this package
    const existingSubscription = await this.prisma.subscription.findFirst({
      where: {
        user_id: createSubscriptionDto.user_id,
        package_id: createSubscriptionDto.package_id,
        status: SubscriptionStatus.active,
      },
    });

    if (existingSubscription) {
      throw new ConflictException(
        'User already has an active subscription for this package',
      );
    }

    // 3. Calculate end date based on duration_days
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + servicePackage.duration_days);

    // 4. Create subscription
    return this.prisma.subscription.create({
      data: {
        user_id: createSubscriptionDto.user_id,
        package_id: createSubscriptionDto.package_id,
        vehicle_id: createSubscriptionDto.vehicle_id,
        start_date: startDate,
        end_date: endDate,
        status: SubscriptionStatus.active,
        swap_used: 0,
      },
      include: {
        package: true,
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
        vehicle: true,
      },
    });
  }

  async findAll() {
    return this.prisma.subscription.findMany({
      include: {
        package: true,
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
        vehicle: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { subscription_id: id },
      include: {
        package: true,
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
        vehicle: true,
      },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return subscription;
  }

  async findOneActiveByVehicleId(vehicleId: number) {
    return await this.prisma.subscription.findFirst({
      where: {
        vehicle_id: vehicleId,
        status: SubscriptionStatus.active,
      },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.subscription.findMany({
      where: { user_id: userId },
      include: {
        package: true,
        vehicle: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findActiveByUser(userId: number) {
    return this.prisma.subscription.findMany({
      where: {
        user_id: userId,
        status: SubscriptionStatus.active,
      },
      include: {
        package: true,
        vehicle: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    // Check if subscription exists
    await this.findOne(id);

    return this.prisma.subscription.update({
      where: { subscription_id: id },
      data: updateSubscriptionDto,
      include: {
        package: true,
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
        vehicle: true,
      },
    });
  }

  async cancel(id: number) {
    // Check if subscription exists and is active
    const subscription = await this.findOne(id);

    if (subscription.status !== SubscriptionStatus.active) {
      throw new BadRequestException('Subscription is not active');
    }

    return this.prisma.subscription.update({
      where: { subscription_id: id },
      data: {
        status: SubscriptionStatus.cancelled,
      },
      include: {
        package: true,
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
        vehicle: true,
      },
    });
  }

  async incrementSwapUsed(id: number, tx?: any) {
    const db = tx ?? this.prisma;
    const subscription = await this.findOne(id);

    // Check if subscription is active
    if (subscription.status !== SubscriptionStatus.active) {
      throw new BadRequestException('Subscription is not active');
    }

    return db.subscription.update({
      where: { subscription_id: id },
      data: {
        swap_used: {
          increment: 1,
        },
      },
      include: {
        package: true,
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
        vehicle: true,
      },
    });
  }

  async updateDistanceTraveled(id: number, distance: number, tx?: any) {
    const db = tx ?? this.prisma;
    const subscription = await this.findOne(id);
    // Check if subscription is active
    if (subscription.status !== SubscriptionStatus.active) {
      throw new BadRequestException('Subscription is not active');
    }

    // Đảm bảo distance là số hợp lệ
    if (typeof distance !== 'number' || isNaN(distance) || distance < 0) {
      throw new BadRequestException('Invalid distance value');
    }

    return db.subscription.update({
      where: { subscription_id: id },
      data: {
        distance_traveled: {
          increment: distance,
        },
      },
      include: {
        package: true,
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
        vehicle: true,
      },
    });
  }

  async checkExpiredSubscriptions() {
    const now = new Date();

    // Find all active subscriptions that have expired
    const expiredSubscriptions = await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.active,
        end_date: {
          lt: now,
        },
      },
    });

    // Update them to expired status
    for (const subscription of expiredSubscriptions) {
      await this.prisma.subscription.update({
        where: { subscription_id: subscription.subscription_id },
        data: {
          status: SubscriptionStatus.expired,
        },
      });
    }

    return {
      message: `Updated ${expiredSubscriptions.length} expired subscriptions`,
      count: expiredSubscriptions.length,
    };
  }

  remove(id: number) {
    return this.prisma.subscription.delete({
      where: { subscription_id: id },
    });
  }
}

