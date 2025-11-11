import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateBatteryTransferTicketDto } from './dto/create-battery-transfer-ticket.dto';
import { UpdateBatteryTransferTicketDto } from './dto/update-battery-transfer-ticket.dto';
import { DatabaseService } from '../database/database.service';
import { StationsService } from '../stations/stations.service';
import { UsersService } from '../users/users.service';
import { BatteriesService } from '../batteries/batteries.service';
import { BatteryTransferRequestService } from '../battery-transfer-request/battery-transfer-request.service';
import { BatteryStatus, TicketType, TransferStatus } from '@prisma/client';
import { findBatteryAvailibleForTransfers } from './dto/get-availibale-batteries-transfer.dto';

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
      this.logger.log(`Creating ticket with DTO:`, JSON.stringify(dto, null, 2));

      const transferRequest = await this.batteryTransferRequestService.findOne(dto.transfer_request_id);
      this.logger.log(`Transfer request found: ${transferRequest.transfer_request_id}, status: ${transferRequest.status}`);

      // Kiểm tra status của transfer request
      //Nếu đã nhập pin thành công thì ko cần tạo thêm ticket với request đó nữa
      if (transferRequest.status === TransferStatus.completed) {
        throw new BadRequestException('Transfer request already completed');
      }

      const station = await this.stationsService.findOne(dto.station_id);
      const staff = await this.usersService.findOneById(dto.staff_id);
      this.logger.log(`Station: ${station.station_id}, Staff: ${staff.user_id}, Ticket type: ${dto.ticket_type}`);

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
          this.logger.log(`Found battery ${batteryId}:`, { battery_id: battery.battery_id, status: battery.status, station_id: battery.station_id });
          return battery;
        })
      );

      this.logger.log(`Total batteries found: ${batteries.length}, Required: ${transferRequest.quantity}`);

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

      // Kiểm tra cho import ticket
      if (dto.ticket_type === TicketType.import) {
        for (const battery of batteries) {
          if (battery.status !== BatteryStatus.in_transit) {
            throw new BadRequestException(
              `Battery ID ${battery.battery_id} is not in transit`
            );
          }
        }
      }

      const existsingTicket = await this.databaseService.batteryTransferTicket.findFirst({
        where: {
          transfer_request_id: dto.transfer_request_id,
          ticket_type: dto.ticket_type,
          station_id: dto.station_id,
        },
      });

      this.logger.log(`Existing ticket check result:`, existsingTicket ? `Found ticket ID ${existsingTicket.ticket_id}` : 'No existing ticket found');
      if (existsingTicket) {
        throw new BadRequestException(`No existing ticket found for transfer request ID ${dto.transfer_request_id} at station ID ${dto.station_id} for ticket type ${dto.ticket_type}`);
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

          //Update transfer request status to completed
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

  async findAll() {
    return await this.databaseService.batteryTransferTicket.findMany({
      include: {
        station: true,
      },
    });
  }

  async findOne(id: number) {
    const ticket = await this.databaseService.batteryTransferTicket.findUnique({
      where: { ticket_id: id },
      include: {
        station: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Battery Transfer Ticket with ID ${id} not found`);
    }

    return ticket;
  }

  async update(id: number, updateBatteryTransferTicketDto: UpdateBatteryTransferTicketDto) {
    const ticket = await this.findOne(id);

    const updatedTicket = await this.databaseService.batteryTransferTicket.update({
      where: { ticket_id: id },
      data: {
        ...updateBatteryTransferTicketDto,
      },
    });

    return updatedTicket;
  }

  async findBatteryTicketByStation(station_id: number) {
    return await this.databaseService.batteryTransferTicket.findMany({
      where: { station_id },
    });
  }

  async getAvailableBatteriesForTransfer(dto: findBatteryAvailibleForTransfers) {
    try {
      const transferRequest = await this.batteryTransferRequestService.findOne(
        dto.transfer_request_id
      );

      // ✅ Tìm pin khớp model + type
      let findDto: any = {
        model: transferRequest.battery_model,
        type: transferRequest.battery_type,
        quantity: transferRequest.quantity
      };

      let availableBatteries: any[] = [];
      // ✅ Dựa vào ticket type để filter
      if (dto.ticket_type === TicketType.export) {
        // Export: pin phải ở station, không in_transit
        findDto = {
          ...findDto,
          station_id: transferRequest.from_station_id,
          status: BatteryStatus.full || BatteryStatus.charging
        };

        availableBatteries = await this.batteriesService.findBatteryAvailibleForTicket(findDto);

        if (availableBatteries.length < transferRequest.quantity) {
          throw new BadRequestException(
            `Not enough available batteries. Required: ${transferRequest.quantity}, Available: ${availableBatteries.length}`
          );
        }
      } else if (dto.ticket_type === TicketType.import) {
        // Import: pin phải đang in_transit (từ export ticket)
        const exportTickets = await this.databaseService.batteryTransferTicket.findMany({
          where: {
            transfer_request_id: dto.transfer_request_id,
            ticket_type: TicketType.export,
          },
          select: {
            batteries: {
              select: {
                battery: true,
              },
            }
          },
        });

        if (exportTickets.length === 0) {
          throw new BadRequestException('No export ticket found for this transfer request');
        }

        // Flatten batteries from export tickets
        const allBatteriesFromExport = exportTickets.flatMap(ticket =>
          ticket.batteries.map(bt => bt.battery)
        );

        if (allBatteriesFromExport.length === 0) {
          throw new BadRequestException('No batteries found in export ticket');
        }

        // ✅ IMPORTANT: Only take the required quantity to match transfer request
        // This ensures import always gets the exact batteries from export ticket
        availableBatteries = allBatteriesFromExport.slice(0, transferRequest.quantity);
      } else {
        throw new BadRequestException('Invalid ticket type');
      }

      return {
        transfer_request: transferRequest,
        required_quantity: transferRequest.quantity,
        available_batteries: availableBatteries,
        available_count: availableBatteries.length,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get available batteries: ${error.message}`
      );
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} batteryTransferTicket`;
  }
}
