import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateBatteryTransferTicketDto } from './dto/create-battery-transfer-ticket.dto';
import { UpdateBatteryTransferTicketDto } from './dto/update-battery-transfer-ticket.dto';
import { DatabaseService } from '../database/database.service';
import { StationsService } from '../stations/stations.service';
import { UsersService } from '../users/users.service';
import { BatteriesService } from '../batteries/batteries.service';
import { BatteryTransferRequestService } from '../battery-transfer-request/battery-transfer-request.service';
import { BatteryStatus, TicketType, TransferStatus } from '@prisma/client';

@Injectable()
export class BatteryTransferTicketService {
  private readonly logger = new Logger(BatteryTransferTicketService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly stationsService: StationsService,
    private readonly usersService: UsersService,
    private readonly batteriesService: BatteriesService,
    private readonly batteryTransferRequestService: BatteryTransferRequestService,
  ) { }

  async create(dto: CreateBatteryTransferTicketDto) {
    try {
      const transferRequest = await this.batteryTransferRequestService.findOne(dto.transfer_request_id);

      // ✅ Kiểm tra status của transfer request
      if (transferRequest.status === TransferStatus.completed) {
        throw new BadRequestException('Transfer request already completed');
      }

      const station = await this.stationsService.findOne(dto.station_id);
      const staff = await this.usersService.findOneById(dto.staff_id);

      if (staff.station_id && staff.station_id !== station.station_id) {
        this.logger.error(`Staff with ID ${staff.user_id} is not belonging to station ID ${station.station_id}`);
        throw new BadRequestException(`This staff is not belonging to this station.`);
      }

      if (dto.ticket_type === TicketType.export && transferRequest.from_station_id !== dto.station_id) {
        this.logger.error(`Station with ID ${dto.station_id} does not match the from_station_id of the transfer request for export ticket.`);
        throw new BadRequestException('Station ID does not match the from_station_id of the transfer request for export ticket.');
      }

      if (dto.ticket_type === TicketType.import && transferRequest.to_station_id !== dto.station_id) {
        this.logger.error(`Station with ID ${dto.station_id} does not match the to_station_id of the transfer request for import ticket.`);
        throw new BadRequestException(`Station ID ${dto.station_id} does not match the to_station_id of the transfer request for import ticket.`);
      }


      const batteries = await Promise.all(
        dto.battery_ids.map(async (batteryId) => {
          const battery = await this.batteriesService.findOne(batteryId);
          return battery;
        })
      );

      if (batteries.length !== transferRequest.quantity) {
        throw new BadRequestException(
          `Number of batteries (${batteries.length}) does not match transfer request quantity (${transferRequest.quantity})`
        );
      }

      for (const battery of batteries) {
        if (battery.model !== transferRequest.battery_model || battery.type !== transferRequest.battery_type) {
          throw new BadRequestException(
            `Battery ID ${battery.battery_id} does not match the required model (${transferRequest.battery_model}) and type (${transferRequest.battery_type})`
          );
        }
      }

      // Additional check: For export tickets, ensure batteries belong to the station
      if (dto.ticket_type === TicketType.export) {
        for (const battery of batteries) {
          if (battery.station_id !== dto.station_id) {
            throw new BadRequestException(
              `Battery ID ${battery.battery_id} does not belong to station ID ${dto.station_id}`
            );
          }
          if (battery.status === BatteryStatus.in_transit) {
            throw new BadRequestException(
              `Battery ID ${battery.battery_id} is already in transit`
            );
          }
        }
      }

      // ✅ Kiểm tra cho import ticket
      if (dto.ticket_type === TicketType.import) {
        for (const battery of batteries) {
          if (battery.status !== BatteryStatus.in_transit) {
            throw new BadRequestException(
              `Battery ID ${battery.battery_id} is not in transit`
            );
          }
        }
      }

      const result = await this.databaseService.$transaction(async (prisma) => {
        // Create the ticket
        this.logger.log(`Creating Battery Transfer Ticket for transfer request ID: ${dto.transfer_request_id}`);
        const ticket = await prisma.batteryTransferTicket.create({
          data: {
            transfer_request_id: dto.transfer_request_id,
            ticket_type: dto.ticket_type,
            station_id: dto.station_id,
            staff_id: dto.staff_id,
          },
        });

        // ✅ SỬA: Dùng đúng tên bảng trung gian
        await prisma.batteriesTransfer.createMany({ // hoặc tên đúng theo schema
          data: dto.battery_ids.map((batteryId) => ({
            ticket_id: ticket.ticket_id,
            battery_id: batteryId,
          })),
        });

        // For export ticket: update battery station_id to null (in transit)
        if (dto.ticket_type === TicketType.export) {
          this.logger.log(`Updating batteries as in transit for Ticket ID: ${ticket.ticket_id}`);
          await prisma.battery.updateMany({
            where: {
              battery_id: {
                in: dto.battery_ids,
              },
            },
            data: {
              station_id: null,
              status: BatteryStatus.in_transit,
            },
          });
        }

        // For import ticket: update battery station_id to destination station
        if (dto.ticket_type === TicketType.import) {
          this.logger.log(`Updating batteries to station ID ${dto.station_id} for Ticket ID: ${ticket.ticket_id}`);
          await prisma.battery.updateMany({
            where: {
              battery_id: {
                in: dto.battery_ids,
              },
            },
            data: {
              station_id: dto.station_id,
              status: BatteryStatus.charging,
            },
          });

          await prisma.batteryTransferRequest.update({
            where: { transfer_request_id: dto.transfer_request_id },
            data: { status: TransferStatus.completed },
          });
        }

        this.logger.log(`Created Battery Transfer Ticket with ID: ${ticket.ticket_id}`);
        return {
          ticket: ticket,
          staff: staff,
          batteries: batteries,
        };
      });

      this.logger.log('Battery Transfer Ticket creation successful');
      return result;
    } catch (error) {
      this.logger.error('Failed to create Battery Transfer Ticket: ' + error.message);
      throw error;
    }
  }

  findAll() {
    return `This action returns all batteryTransferTicket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} batteryTransferTicket`;
  }

  update(id: number, updateBatteryTransferTicketDto: UpdateBatteryTransferTicketDto) {
    return `This action updates a #${id} batteryTransferTicket`;
  }

  remove(id: number) {
    return `This action removes a #${id} batteryTransferTicket`;
  }
}
