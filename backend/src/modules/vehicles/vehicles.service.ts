import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { DatabaseService } from '../database/database.service';
import { VehicleStatus } from '@prisma/client';
import { stat } from 'fs';

@Injectable()
export class VehiclesService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createVehicleDto: CreateVehicleDto) {
    try {
      return await this.databaseService.vehicle.create({
        data: createVehicleDto,
        include: {
          user: {
            select: {
              user_id: true,
              username: true,
              email: true,
              role: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('VIN already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.databaseService.vehicle.findMany({
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const vehicle = await this.databaseService.vehicle.findUnique({
      where: { vehicle_id: id },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async findByUser(userId: number) {
    return await this.databaseService.vehicle.findMany({
      where: { user_id: userId },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findOneActiveByUserId(userId: number) {
    return await this.databaseService.vehicle.findFirst({
      where: {
        user_id: userId,
        status: VehicleStatus.active
      },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findByVin(vin: string) {
    const vehicle = await this.databaseService.vehicle.findUnique({
      where: { vin },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with VIN ${vin} not found`);
    }

    return vehicle;
  }

  async updateBatteryId(vehicle_id: number, battery_id: number) {
    await this.findOne(vehicle_id); // Check if vehicle exists
    return await this.databaseService.vehicle.update({
      where: { vehicle_id },
      data: { battery_id },
    });
  }

  async removeBatteryFromVehicle(vehicle_id: number) {
    await this.findOne(vehicle_id); // Check if vehicle exists
    return await this.databaseService.vehicle.update({
      where: { vehicle_id },
      data: { battery_id: null },
    });
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    await this.findOne(id); // Check if vehicle exists

    try {
      return await this.databaseService.vehicle.update({
        where: { vehicle_id: id },
        data: updateVehicleDto,
        include: {
          user: {
            select: {
              user_id: true,
              username: true,
              email: true,
              role: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('VIN already exists');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id); // Check if vehicle exists

    return await this.databaseService.vehicle.delete({
      where: { vehicle_id: id },
    });
  }
}
