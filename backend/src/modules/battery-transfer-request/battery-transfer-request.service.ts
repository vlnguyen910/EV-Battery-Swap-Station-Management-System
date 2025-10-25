import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBatteryTransferRequestDto } from './dto/create-battery-transfer-request.dto';
import { UpdateBatteryTransferRequestDto } from './dto/update-battery-transfer-request.dto';
import { StationsService } from '../stations/stations.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BatteryTransferRequestService {
  constructor(
    private readonly stationsService: StationsService,
    private readonly databaseService: DatabaseService,
  ) { }

  async create(dto: CreateBatteryTransferRequestDto) {
    try {
      const from_station = await this.stationsService.findOne(dto.from_station_id);
      const to_station = await this.stationsService.findOne(dto.to_station_id);

      const batteryTransferRequest = await this.databaseService.batteryTransferRequest.create({
        data: {
          battery_model: dto.battery_model,
          battery_type: dto.battery_type,
          quantity: dto.quantity,
          from_station_id: from_station.station_id,
          to_station_id: to_station.station_id,
        },
      });

      return batteryTransferRequest;
    } catch (error) {
      throw new Error('Failed to create battery transfer request: ' + error.message);
    }
  }

  async findAll() {
    return await this.databaseService.batteryTransferRequest.findMany();
  }

  async findOne(id: number) {
    const request = await this.databaseService.batteryTransferRequest.findUnique({
      where: { transfer_request_id: id },
    });

    if (!request) {
      throw new NotFoundException(`Battery transfer request with ID ${id} not found`);
    }

    return request;
  }

  update(id: number, dto: UpdateBatteryTransferRequestDto) {
    try {
      const updatedRequest = this.databaseService.batteryTransferRequest.update({
        where: { transfer_request_id: id },
        data: {
          status: dto.status
        },
      });

      return updatedRequest;
    } catch (error) {
      throw new Error('Failed to update battery transfer request: ' + error.message);
    }
  }
}
