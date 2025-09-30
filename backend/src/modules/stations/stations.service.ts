import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
import { DatabaseService } from '../database/database.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class StationsService {
  constructor(
    private vehiclesService: VehiclesService,
    private databaseService: DatabaseService
  ) { }

  create(createStationDto: CreateStationDto) {
    return 'This action adds a new station';
  }

  findAll() {
    return `This action returns all stations`;
  }

  async findAllAvailable(
    user_id: number,
    latitude: Decimal,
    longitude: Decimal,
    radiusKm: number = 20
  ) {
    const vehicles = await this.vehiclesService.findByUser(user_id);

    if (vehicles.length === 0) {
      throw new NotFoundException('No vehicles found for this user');
    }

    const activeVehicles = vehicles.filter(vehicles => vehicles.status === 'active');

    if (activeVehicles.length === 0) {
      throw new NotFoundException('No active vehicles found for this user');
    }

    const { battery_model, battery_type } = activeVehicles[0];

    const allAvailableStations = await this.databaseService.swappingStation.findMany({
      where: {
        status: 'active',
        batteries: {
          some: {
            model: battery_model,
            type: battery_type,
            status: 'full'
          }
        }
      },
      select: {
        station_id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        status: true,
        _count: {
          select: {
            batteries: {
              where: {
                model: battery_model,
                type: battery_type,
                status: 'full'
              }
            }
          }
        }
      }
    });

    if (allAvailableStations.length === 0) {
      throw new NotFoundException('No available stations found');
    }

    const result = allAvailableStations.map(station => ({
      station_id: station.station_id,
      name: station.name,
      address: station.address,
      latitude: station.latitude,
      longitude: station.longitude,
      status: station.status,
      available_batteries: station._count.batteries,
      distance: this.calculateDistance(latitude, longitude, station.latitude, station.longitude)
    }))
      .sort((a, b) => a.distance - b.distance);

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} station`;
  }

  update(id: number, updateStationDto: UpdateStationDto) {
    return `This action updates a #${id} station`;
  }

  remove(id: number) {
    return `This action removes a #${id} station`;
  }

  private calculateDistance(lat1: Decimal, lon1: Decimal, lat2: Decimal, lon2: Decimal): number {
    const R = 6371; // Earth's radius in kilometers

    // Convert all Decimal to number for mathematical operations
    const lat1Num = lat1.toNumber();
    const lon1Num = lon1.toNumber();
    const lat2Num = lat2.toNumber();
    const lon2Num = lon2.toNumber();

    const dLat = this.toRadians(lat2Num - lat1Num);
    const dLon = this.toRadians(lon2Num - lon1Num);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1Num)) * Math.cos(this.toRadians(lat2Num)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
