import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateBatteryDto } from './dto/create-battery.dto';
import { UpdateBatteryDto } from './dto/update-battery.dto';
import { DatabaseService } from '../database/database.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { BatteryStatus } from '@prisma/client';
import { StationsService } from '../stations/stations.service';
import { findBatteryAvailibleForTicket } from './dto/find-availiable-batteries-ticket.dto';

@Injectable()
export class BatteriesService {
  constructor(
    private databaseService: DatabaseService,
    private vehiclesService: VehiclesService,
    private stationsService: StationsService,
  ) { }

  private readonly logger = new Logger(BatteriesService.name);

  create(createBatteryDto: CreateBatteryDto) {
    this.logger.log('Creating a new battery');
    return 'This action adds a new battery';
  }

  findAll() {
    return this.databaseService.battery.findMany();
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
    const battery = await this.databaseService.battery.findUnique({
      where: { battery_id: id },
    });
    if (!battery) {
      throw new NotFoundException(`Battery with ID ${id} not found`);
    }
    return battery;
  }

  async findBatteryAvailibleForTicket(dto: findBatteryAvailibleForTicket) {
    const availableBatteries = await this.databaseService.battery.findMany({
      where: {
        model: dto.model,
        type: dto.type,
        station_id: dto.station_id,
        status: dto.status
      },
      take: dto.quantity, // Giới hạn theo số lượng cần
      select: {
        battery_id: true,
        model: true,
        type: true,
        soh: true,
        status: true,
        station_id: true,
      },
    });

    return availableBatteries;
  }

  async assignBatteryToVehicle(
    battery_id: number,
    vehicle_id: number,
    tx?: any // transaction instance
  ) {
    try {
      const db = tx ?? this.databaseService;

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

      // Ensure no other battery is currently assigned to this vehicle (avoid unique constraint)
      await db.battery.updateMany({
        where: { vehicle_id },
        data: { vehicle_id: null },
      });

      // Assign battery to vehicle
      this.logger.log(`Assigning battery ${battery_id} to vehicle ${vehicle_id}`);
      return await db.battery.update({
        where: { battery_id },
        data: { vehicle_id, station_id: null, status: BatteryStatus.in_use },
      });
    } catch (error) {
      this.logger.error(`Error assigning battery to vehicle: ${error.message}`);
      throw error;
    }
  }

  async returnBatteryToStation(
    battery_id: number,
    station_id: number,
    tx?: any // transaction instance
  ) {
    try {
      const db = tx ?? this.databaseService;

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
      this.logger.log(`Returning battery ID ${battery_id} to station ID ${station_id}`);
      return await db.battery.update({
        where: { battery_id },
        data: { station_id, vehicle_id: null, status: BatteryStatus.charging },
      });
    } catch (error) {
      this.logger.error(`Error returning battery to station: ${error.message}`);
      throw error;
    }
  }

  async updateBatteryStatus(id: number, status: BatteryStatus, tx?: any) {
    const prisma = tx ?? this.databaseService;
    const battery = await this.findOne(id);

    if (!battery) {
      throw new NotFoundException(`Battery with ID ${id} not found`);
    }

    const updatedBattery = await prisma.battery.update({
      where: { battery_id: id },
      data: { status },
    });
    this.logger.log(`Updated battery ID ${id} from ${battery.status} to status ${status}`);

    return updatedBattery;
  }

  remove(id: number) {
    return `This action removes a #${id} battery`;
  }

  /**
   * Simulate battery discharge (driver di chuyển)
   * Giảm current_charge của battery
   */
  async simulateDischarge(battery_id: number, new_charge?: number, decrease_amount?: number) {
    const battery = await this.findOne(battery_id);

    if (battery.status !== BatteryStatus.in_use) {
      throw new BadRequestException(
        `Cannot simulate discharge for battery with status ${battery.status}. Only batteries in_use can be discharged.`
      );
    }

    let targetCharge: number;

    if (new_charge !== undefined) {
      // Sử dụng new_charge được cung cấp
      targetCharge = new_charge;
    } else if (decrease_amount !== undefined) {
      // Giảm theo số lượng cụ thể
      targetCharge = Math.max(0, Number(battery.current_charge) - decrease_amount);
    } else {
      // Random decrease 5-20%
      const randomDecrease = Math.floor(Math.random() * 16) + 5; // 5-20
      targetCharge = Math.max(0, Number(battery.current_charge) - randomDecrease);
    }

    const updatedBattery = await this.databaseService.battery.update({
      where: { battery_id },
      data: { current_charge: targetCharge },
      include: {
        vehicle: {
          select: {
            vehicle_id: true,
            vin: true,
            user_id: true,
          },
        },
      },
    });

    this.logger.log(
      `Battery ${battery_id} discharged from ${battery.current_charge}% to ${targetCharge}%`
    );

    return {
      battery_id: updatedBattery.battery_id,
      previous_charge: Number(battery.current_charge),
      current_charge: Number(updatedBattery.current_charge),
      decrease_amount: Number(battery.current_charge) - targetCharge,
      status: updatedBattery.status,
      vehicle: updatedBattery.vehicle,
      message: `Battery discharged from ${battery.current_charge}% to ${targetCharge}%`,
    };
  }

  /**
   * Set battery charge to specific value (admin only)
   * Dùng để test hoặc admin điều chỉnh
   */
  async setBatteryCharge(battery_id: number, charge_percentage: number) {
    const battery = await this.findOne(battery_id);

    const previousCharge = Number(battery.current_charge);
    
    const updatedBattery = await this.databaseService.battery.update({
      where: { battery_id },
      data: { current_charge: charge_percentage },
      include: {
        vehicle: {
          select: {
            vehicle_id: true,
            vin: true,
            user_id: true,
          },
        },
        station: {
          select: {
            station_id: true,
            name: true,
          },
        },
      },
    });

    this.logger.log(
      `Battery ${battery_id} charge set from ${previousCharge}% to ${charge_percentage}%`
    );

    return {
      battery_id: updatedBattery.battery_id,
      previous_charge: previousCharge,
      current_charge: Number(updatedBattery.current_charge),
      change_amount: charge_percentage - previousCharge,
      status: updatedBattery.status,
      vehicle: updatedBattery.vehicle,
      station: updatedBattery.station,
      message: `Battery charge set to ${charge_percentage}%`,
    };
  }

  /**
   * Simulate charging battery (tăng charge)
   * Dùng khi battery đang charging tại station
   */
  async simulateCharging(battery_id: number, increase_amount?: number) {
    const battery = await this.findOne(battery_id);

    if (battery.status !== BatteryStatus.charging) {
      throw new BadRequestException(
        `Cannot charge battery with status ${battery.status}. Only batteries with status 'charging' can be charged.`
      );
    }

    const currentCharge = Number(battery.current_charge);
    const increaseBy = increase_amount ?? Math.floor(Math.random() * 21) + 10; // 10-30% random
    const targetCharge = Math.min(100, currentCharge + increaseBy);

    const updatedBattery = await this.databaseService.battery.update({
      where: { battery_id },
      data: {
        current_charge: targetCharge,
        // Nếu đạt 100%, chuyển sang full
        status: targetCharge >= 100 ? BatteryStatus.full : BatteryStatus.charging,
      },
      include: {
        station: {
          select: {
            station_id: true,
            name: true,
          },
        },
      },
    });

    this.logger.log(
      `Battery ${battery_id} charged from ${currentCharge}% to ${targetCharge}%`
    );

    return {
      battery_id: updatedBattery.battery_id,
      previous_charge: currentCharge,
      current_charge: Number(updatedBattery.current_charge),
      increase_amount: targetCharge - currentCharge,
      status: updatedBattery.status,
      is_full: targetCharge >= 100,
      station: updatedBattery.station,
      message: targetCharge >= 100 
        ? `Battery fully charged and status changed to 'full'` 
        : `Battery charging: ${currentCharge}% → ${targetCharge}%`,
    };
  }
}
