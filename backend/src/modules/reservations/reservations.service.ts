import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { BatteriesService } from '../batteries/batteries.service';
import { DatabaseService } from '../database/database.service';
import { ReservationStatus } from '@prisma/client';
import { VehiclesService } from '../vehicles/vehicles.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReservationsService {
  constructor(
    private batteriesService: BatteriesService,
    private databaseService: DatabaseService,
    private vehicleService: VehiclesService,
    private userService: UsersService,
  ) { }

  private readonly logger = new Logger(ReservationsService.name);

  async create(dto: CreateReservationDto) {
    try {
      //1. Check user có tồn tại
      const user = await this.userService.findOneById(dto.user_id);

      if (!user) {
        throw new NotFoundException('User with ID: qq ' + dto.user_id + ' not exist');
      }

      //2. lấy active vehicle của driver nếu không nhập vehicle_id
      let selectedVehicleId = dto.vehicle_id;
      if (!selectedVehicleId) {
        const vehicle = await this.vehicleService.findOneActiveByUserId(dto.user_id);

        if (!vehicle) {
          throw new NotFoundException('Not found driver vehicle or not active yet');
        }

        selectedVehicleId = vehicle.vehicle_id;
      }

      //3. lấy best battery nếu không nhập battery_id
      let selectedBatteryId = dto.battery_id;
      if (!selectedBatteryId) {
        const availableBattery = await this.batteriesService.findBestBatteryForVehicle(
          dto.vehicle_id,
          dto.station_id
        )

        if (!availableBattery) {
          throw new NotFoundException('No compatible battery available at station');
        }

        selectedBatteryId = availableBattery.battery_id;
      }

      const now = new Date();
      const scheduledTime = new Date(dto.scheduled_time);
      const maxAllowed = new Date(now.getTime() + 60 * 60 * 1000);

      // 4. kiểm tra đặt lịch trong quá khứ
      if (scheduledTime < now) {
        throw new BadRequestException('Cannot not schedule in the past')
      }

      // 5. kiểm tra đặt quá giờ cho phép. Ex: đặt vào ngày mai
      if (scheduledTime > maxAllowed) {
        throw new BadRequestException('You can only schedule max is 1 hour');
      }

      //6. kiểm tra user có đặt lịch trùng 
      const existing = await this.databaseService.reservation.findFirst({
        where: {
          user_id: dto.user_id,
          vehicle_id: selectedVehicleId,
          status: 'scheduled'
        }
      })

      if (existing) {
        throw new BadRequestException('You already have a reservation for this vehicle at this time');
      }

      //7. tạo lịch nếu các params hợp lệ
      const newReservation = await this.databaseService.reservation.create({
        data: {
          user_id: dto.user_id,
          vehicle_id: dto.vehicle_id,
          battery_id: selectedBatteryId,
          station_id: dto.station_id,
          scheduled_time: dto.scheduled_time,
          status: 'scheduled'
        }
      })

      if (selectedBatteryId) {
        await this.batteriesService.updateBatteryStatus(selectedBatteryId, 'booked');
      }

      this.logger.log(
        `✅ Reservation created successfully for user ${dto.user_id} with battery ${selectedBatteryId}`,
      );

      return newReservation;
    } catch (error) {
      this.logger.error(
        `Failed to create reservation for user ${dto.user_id}`,
        error.stack || error.message,
      );

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Unexpected error while creating reservation');
    }
  }

  findAll() {
    return `This action returns all reservations`;
  }

  async findManyByUserId(userId: number) {
    return await this.databaseService.reservation.findMany({
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

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  async updateReservationStatus(
    id: number,
    user_id: number,
    status: ReservationStatus
  ) {
    const reservationUpdate = await this.databaseService.reservation.findUnique({
      where: { reservation_id: id }
    })

    if (!reservationUpdate || reservationUpdate.user_id != user_id) {
      throw new NotFoundException(`Reservation not found or made by user with ID ${user_id}`);
    }

    return await this.databaseService.reservation.update({
      where: { reservation_id: id },
      data: { status }
    });
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }

  //@Cron(CronExpression.EVERY_3_MINUTE)
  @Interval(60000) // chạy mỗi phút 
  async cancelExpiredReservations() {
    const now = new Date();

    // Tìm tất cả reservation scheduled nhưng đã qua thời gian
    const expiredReservations = await this.databaseService.reservation.findMany({
      where: {
        status: 'scheduled',
        scheduled_time: {
          lt: now,
        },
      },
    });

    if (expiredReservations.length > 0) {
      const expiredReservationIds = expiredReservations.map(r => r.reservation_id);

      await this.databaseService.reservation.updateMany({
        where: { reservation_id: { in: expiredReservationIds } },
        data: { status: ReservationStatus.cancelled },
      });

      this.logger.log(`⏰ Auto-canceled ${expiredReservationIds.length} expired reservations: ${expiredReservationIds.join(', ')}`);
    }
  }
}
