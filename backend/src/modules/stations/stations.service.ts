import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
import { DatabaseService } from '../database/database.service';

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

  async findAllAvailable(user_id: number) {
    const vehicles = await this.vehiclesService.findByUser(user_id);

    if (vehicles.length === 0) {
      throw new NotFoundException('No vehicles found for this user');
    }

    //const {battery_model, battery_type} = vehicles.filter(v => v.status === 'active')[0];

    return vehicles.filter(v => v.status === 'active')[0];
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
}
