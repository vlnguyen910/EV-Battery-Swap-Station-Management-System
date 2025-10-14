import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBatteryDto } from './dto/create-battery.dto';
import { UpdateBatteryDto } from './dto/update-battery.dto';
import { DatabaseService } from '../database/database.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { BatteryStatus } from '@prisma/client';
import { StationsService } from '../stations/stations.service';

@Injectable()
export class BatteriesService {
  constructor(
    private databaseService: DatabaseService,
    private vehiclesService: VehiclesService,
    private stationsService: StationsService,
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

  async findOne(id: number) {
    return await this.databaseService.battery.findUnique({
      where: { battery_id: id },
    });
  }

  async assignBatteryToVehicle(battery_id: number, vehicle_id: number) {
    // Check if battery exists and is full
    const battery = await this.findOne(battery_id);
    if (!battery) {
      throw new NotFoundException(`Battery with ID ${battery_id} not found`);
    }
    if (battery.status !== 'full') {
      throw new BadRequestException(`Battery with ID ${battery_id} is not full`);
    }

    // Check if vehicle exists
    const vehicle = await this.vehiclesService.findOne(vehicle_id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicle_id} not found`);
    }

    // Assign battery to vehicle
    return await this.databaseService.battery.update({
      where: { battery_id },
      data: { vehicle_id, station_id: null, status: BatteryStatus.in_use },
    });
  }

  async returnBatteryFromVehicle(battery_id: number, station_id: number) {
    // Check if battery exists
    const battery = await this.findOne(battery_id);
    if (!battery) {
      throw new NotFoundException(`Battery with ID ${battery_id} not found`);
    }

    // Check if station exists
    const station = await this.stationsService.findOne(station_id);
    if (!station) {
      throw new NotFoundException(`Station with ID ${station_id} not found`);
    }

    // Return battery to station
    return await this.databaseService.battery.update({
      where: { battery_id },
      data: { station_id, vehicle_id: null, status: BatteryStatus.charging },
    });
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
