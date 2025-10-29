import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateSwapTransactionDto } from './dto/create-swap-transaction.dto';
import { UpdateSwapTransactionDto } from './dto/update-swap-transaction.dto';
import { UsersService } from '../users/users.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { StationsService } from '../stations/stations.service';
import { BatteriesService } from '../batteries/batteries.service';
import { DatabaseService } from '../database/database.service';
import { BatteryStatus, SwapTransactionStatus } from '@prisma/client';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';


@Injectable()
export class SwapTransactionsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
    private readonly vehiclesService: VehiclesService,
    private readonly stationsService: StationsService,
    private readonly batteriesService: BatteriesService,
    private readonly subcriptionsService: SubscriptionsService,
  ) { }

  async create(
    createDto: CreateSwapTransactionDto,
    tx?: any // transaction object
  ) {
    const [user, vehicle, station, battery_taken, subscription] = await Promise.all([
      this.usersService.findOneById(createDto.user_id),
      this.vehiclesService.findOne(createDto.vehicle_id),
      this.stationsService.findOne(createDto.station_id),
      this.batteriesService.findOne(createDto.battery_taken_id),
      this.subcriptionsService.findOne(createDto.subscription_id),
    ]);

    const prisma = tx || this.databaseService;

    try {
      if (!user) {
        throw new NotFoundException({ message: `User with ID ${createDto.user_id} not found` });
      }

      if (!vehicle) {
        throw new NotFoundException({ message: `Vehicle with ID ${createDto.vehicle_id} not found` });
      }

      if (vehicle.user_id !== createDto.user_id) {
        throw new NotFoundException({ message: `Vehicle with ID ${createDto.vehicle_id} not owned by user with ID ${createDto.user_id}` });
      }

      if (!station) {
        throw new NotFoundException({ message: `Station with ID ${createDto.station_id} not found` });
      }

      if (!battery_taken) {
        throw new NotFoundException({ message: `Battery with ID ${createDto.battery_taken_id} not found` });
      }

      if (battery_taken.station_id !== createDto.station_id) {
        throw new NotFoundException({ message: `Battery with ID ${createDto.battery_taken_id} not located at station with ID ${createDto.station_id}` });
      }

      if (battery_taken.status !== BatteryStatus.full) {
        throw new NotFoundException({ message: `Battery with ID ${createDto.battery_taken_id} is not full` });
      }

      if (createDto.battery_returned_id) {
        const battery_returned = await this.batteriesService.findOne(createDto.battery_returned_id);

        if (!battery_returned) {
          throw new NotFoundException({ message: `Battery with ID ${createDto.battery_returned_id} not found` });
        }
      }

      if (!subscription) {
        throw new NotFoundException({ message: `No active subscription found for vehicle ID ${createDto.vehicle_id}` });
      }

      if (subscription.user_id !== createDto.user_id) {
        throw new NotFoundException({ message: `Subscription with ID ${subscription.subscription_id} not owned by user with ID ${createDto.user_id}` });
      }

      if (subscription.vehicle_id !== createDto.vehicle_id) {
        throw new NotFoundException({ message: `Subscription with ID ${subscription.subscription_id} not for vehicle with ID ${createDto.vehicle_id}` });
      }

      // Create swap transaction
      return await prisma.swapTransaction.create({
        data: {
          user_id: createDto.user_id,
          vehicle_id: createDto.vehicle_id,
          station_id: createDto.station_id,
          battery_taken_id: createDto.battery_taken_id,
          battery_returned_id: createDto.battery_returned_id || null,
          subscription_id: createDto.subscription_id,
          status: createDto.status,
        }
      });
    } catch (error) {
      throw new InternalServerErrorException({ message: `Failed to create swap transaction: ${error.message}` });
    }
  }

  async findAll() {
    return await this.databaseService.swapTransaction.findMany({
      orderBy: { createAt: 'desc' }
    });
  }

  findAllByUserId(user_id: number) {
    return this.databaseService.swapTransaction.findMany({
      where: { user_id: user_id },
      orderBy: { createAt: 'desc' }
    });
  }

  findOne(id: number) {
    return this.databaseService.swapTransaction.findUnique({
      where: { transaction_id: id },
    });
  }

  async updateStatus(
    id: number,
    status: SwapTransactionStatus
  ) {
    try {
      return await this.databaseService.swapTransaction.update({
        where: { transaction_id: id },
        data: { status: status }
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update swap transaction status');
    }
  }


  update(id: number, updateSwapTransactionDto: UpdateSwapTransactionDto) {
    return `This action updates a #${id} swapTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} swapTransaction`;
  }
}
