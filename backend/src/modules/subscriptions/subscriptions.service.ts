import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException, Logger,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { DatabaseService } from '../database/database.service';
import { SubscriptionStatus } from '@prisma/client';
import { BatteryServicePackagesService } from '../battery-service-packages/battery-service-packages.service';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private prisma: DatabaseService,
    private packageService: BatteryServicePackagesService,
  ) { }

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    // 1. Check if package exists and is active
    const servicePackage = await this.packageService.findOne(createSubscriptionDto.package_id);

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

  async findOneByVehicleId(vehicleId: number) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        vehicle_id: vehicleId,
      },
    });

    if (!subscription) {
      throw new NotFoundException(`Active subscription for vehicle ID ${vehicleId} not found`);
    }

    return subscription;
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
    if (typeof distance !== 'number' || isNaN(distance) || distance <= 0) {
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

  async updateExpiredSubscriptions(): Promise<{ count: number; subscriptions: any[] }> {
    const now = new Date();

    // Find all active subscriptions that have expired
    const expiredSubscriptions = await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.active,
        end_date: {
          lt: now,
        },
      },
      include: {
        package: true,
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (expiredSubscriptions.length === 0) {
      this.logger.log('No expired subscriptions found at this time.');
      return {
        count: 0,
        subscriptions: [],
      };
    }

    const expiredIds = expiredSubscriptions.map(sub => sub.subscription_id);

    // Subscriptions that have exceeded base distance and need penalty payment
    const needPaymentIds = expiredSubscriptions
      .filter(sub => sub.distance_traveled > sub.package.base_distance)
      .map(sub => sub.subscription_id);

    await this.prisma.subscription.updateMany({
      where: {
        subscription_id: { in: expiredIds },
      },
      data: {
        status: SubscriptionStatus.expired,
      },
    });
    this.logger.log(`Marked ${expiredIds.length} subscriptions as expired.`);

    await this.prisma.subscription.updateMany({
      where: {
        subscription_id: { in: needPaymentIds },
      },
      data: {
        status: SubscriptionStatus.pending_penalty_payment,
      },
    });
    this.logger.log(`Marked ${needPaymentIds.length} subscriptions as pending penalty payment.`);

    this.logger.log(`Expired ${expiredSubscriptions.length} subscriptions.`);
    return {
      count: expiredSubscriptions.length,
      subscriptions: expiredSubscriptions.map(sub => ({
        subscription_id: sub.subscription_id,
        user_id: sub.user_id,
        username: sub.user.username,
        package_name: sub.package.name,
        end_date: sub.end_date,
      })),
    };
  }

  remove(id: number) {
    return this.prisma.subscription.delete({
      where: { subscription_id: id },
    });
  }

  async calculatePenaltyFee(id: number): Promise<number> {
    const subscription = await this.findOne(id);

    // Check if subscription is expired
    if (subscription.status !== SubscriptionStatus.expired) {
      throw new BadRequestException('Subscription is not expired');
    }

    // Calculate penalty fee
    //TODO: chỉnh lại phí phạt
    const penaltyFee = subscription.distance_traveled * subscription.package.penalty_fee;

    return penaltyFee;
  }
}
