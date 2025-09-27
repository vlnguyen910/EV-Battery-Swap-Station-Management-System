import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateChangingStationDto } from './dto/create-changing-station.dto';
import { UpdateChangingStationDto } from './dto/update-changing-station.dto';
import { DatabaseService } from '../database/database.service';
import { StationStatus } from '@prisma/client';

@Injectable()
export class ChangingStationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createChangingStationDto: CreateChangingStationDto) {
    try {
      return await this.databaseService.changingStation.create({
        data: createChangingStationDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Station name already exists');
      }
      throw error;
    }
  }

  async findAll(status?: StationStatus) {
    const whereClause = status ? { status } : {};
    
    return await this.databaseService.changingStation.findMany({
      where: whereClause,
      orderBy: {
        station_id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const station = await this.databaseService.changingStation.findUnique({
      where: { station_id: id },
    });

    if (!station) {
      throw new NotFoundException(`Changing Station with ID ${id} not found`);
    }

    return station;
  }

  async findByName(name: string) {
    const stations = await this.databaseService.changingStation.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    return stations;
  }

  async findByLocation(latitude: number, longitude: number, radiusKm: number = 10) {
    // Simple distance calculation (for demonstration)
    // In production, you might want to use PostGIS or similar
    const stations = await this.databaseService.changingStation.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
        status: 'active',
      },
    });

    // Filter by distance (simplified calculation)
    return stations.filter(station => {
      if (!station.latitude || !station.longitude) return false;
      
      const distance = this.calculateDistance(
        latitude, longitude,
        station.latitude, station.longitude
      );
      
      return distance <= radiusKm;
    });
  }

  async findActiveStations() {
    return await this.databaseService.changingStation.findMany({
      where: { status: 'active' },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async update(id: number, updateChangingStationDto: UpdateChangingStationDto) {
    await this.findOne(id); // Check if station exists

    try {
      return await this.databaseService.changingStation.update({
        where: { station_id: id },
        data: updateChangingStationDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Station name already exists');
      }
      throw error;
    }
  }

  async updateStatus(id: number, status: StationStatus) {
    await this.findOne(id); // Check if station exists

    return await this.databaseService.changingStation.update({
      where: { station_id: id },
      data: { status },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if station exists

    return await this.databaseService.changingStation.delete({
      where: { station_id: id },
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Haversine formula: a = sin²(Δϕ) + cos(ϕ1)⋅cos(ϕ2)⋅sin²(Δλ)
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
