import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBatteryDto } from './dto/create-battery.dto';
import { UpdateBatteryDto } from './dto/update-battery.dto';
import { DatabaseService } from '../database/database.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { BatteryStatus } from '@prisma/client';

@Injectable()
export class BatteriesService {
  constructor(
    private databaseService: DatabaseService,
    private vehiclesService: VehiclesService
  ) { }

  create(createBatteryDto: CreateBatteryDto) {
    return 'This action adds a new battery';
  }

  findAll() {
    return `This action returns all batteries`;
  }

  async findAllByStationId(station_id: number) {
    return await this.databaseService.battery.findMany({
      where: { station_id },
    });
  }

  async findCompatibleBatteries(
    model: string,
    type: string,
    status: BatteryStatus = 'full',
  ) {
    return await this.databaseService.battery.findMany({
      where: {
        model,
        type,
        status
      }
    });
  }

  async findBestBatteryForVehicle(
    vehicle_id: number,
    station_id: number,
  ) {

    const { battery_model, battery_type } = await this.vehiclesService.findOne(vehicle_id);

    if (!battery_model || !battery_type) {
      throw new NotFoundException('Vehicle not found or missing battery model/type');
    }

    const bestBattery = await this.databaseService.battery.findFirst({
      where: {
        station_id,
        model: battery_model,
        type: battery_type,
        status: 'full'
      },
      orderBy: {
        soh: 'desc'
      }
    });

    if (!bestBattery) {
      throw new NotFoundException('No compatible battery found');
    }

    return bestBattery;
  }

  findOne(id: number) {
    return `This action returns a #${id} battery`;
  }

  update(id: number, updateBatteryDto: UpdateBatteryDto) {
    return `This action updates a #${id} battery`;
  }

  updateBatteryStatus(id: number, status: BatteryStatus) {
    return this.databaseService.battery.update({
      where: { battery_id: id },
      data: { status },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} battery`;
  }
}
