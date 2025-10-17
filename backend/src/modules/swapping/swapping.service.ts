import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SwappingDto } from './dto/swapping.dto';
import { UsersService } from '../users/users.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { BatteriesService } from '../batteries/batteries.service';
import { StationsService } from '../stations/stations.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { DatabaseService } from '../database/database.service';
import { SwapTransactionsService } from '../swap-transactions/swap-transactions.service';
@Injectable()
export class SwappingService {
    constructor(
        private databaseService: DatabaseService,
        private usersService: UsersService,
        private vehiclesService: VehiclesService,
        private batteriesService: BatteriesService,
        private stationsService: StationsService,
        private swapTransactionsService: SwapTransactionsService,
        private subscriptionsService: SubscriptionsService,
    ) { }

    private readonly logger = new Logger(SwappingService.name);

    async swapBatteries(swapDto: SwappingDto) {
        const { user_id, vehicle_id, station_id, return_battery_id } = swapDto;

        try {
            // Check user is exist
            const user = await this.usersService.findOneById(user_id);
            if (!user) {
                this.logger.warn(`User with ID ${user_id} not found`);
                throw new NotFoundException(`User with ID ${user_id} not found`);
            }

            const vehicle = await this.vehiclesService.findOne(vehicle_id);
            if (!vehicle) {
                this.logger.warn(`Vehicle with ID ${vehicle_id} not found`);
                throw new NotFoundException(`Vehicle with ID ${vehicle_id} not found`);
            }

            // Check station is exist
            const station = await this.stationsService.findOne(station_id);
            if (!station) {
                this.logger.warn(`Station with ID ${station_id} not found`);
                throw new NotFoundException(`Station with ID ${station_id} not found`);
            }

            // Check return battery is exist
            const returnBattery = await this.batteriesService.findOne(return_battery_id);
            if (!returnBattery) {
                this.logger.warn(`Battery with ID ${return_battery_id} not found`);
                throw new NotFoundException(`Battery with ID ${return_battery_id} not found`);
            }

            const takenBatteryId = await this.batteriesService.findBestBatteryForVehicle(vehicle_id, station_id);
            if (!takenBatteryId) {
                this.logger.warn(`No suitable battery available at station ID ${station_id} for vehicle ID ${vehicle_id}`);
                throw new NotFoundException(`No suitable battery available at station ID ${station_id} for vehicle ID ${vehicle_id}`);
            }

            // Check return battery belongs to vehicle
            if (vehicle.battery_id !== return_battery_id) {
                this.logger.warn(`Battery ID ${return_battery_id} does not belong to vehicle ID ${vehicle_id}`);
                throw new NotFoundException(`Battery ID ${return_battery_id} does not belong to vehicle ID ${vehicle_id}`);
            }

            // Check user subscription is valid
            const subscription = await this.subscriptionsService.findOneActiveByVehicleId(vehicle_id);
            if (!subscription) {
                this.logger.warn(`No active subscription found for vehicle ID ${vehicle_id} `);
                throw new NotFoundException(`No active subscription found for vehicle ID ${vehicle_id} `);
            }

            return await this.databaseService.$transaction(async (prisma) => {
                await this.batteriesService.returnBatteryToStation(return_battery_id, station_id, prisma);
                await this.batteriesService.assignBatteryToVehicle(takenBatteryId.battery_id, vehicle_id, prisma);
                await this.vehiclesService.updateBatteryId(vehicle_id, takenBatteryId.battery_id, prisma);

                const swapRecord = await this.swapTransactionsService.create({
                    user_id,
                    vehicle_id,
                    station_id,
                    battery_taken_id: takenBatteryId.battery_id,
                    battery_returned_id: return_battery_id,
                    subscription_id: subscription.subscription_id,
                    status: 'completed',
                }, prisma);

                return {
                    message: 'Battery swap successful',
                    swapTransaction: swapRecord,
                }
            });

        } catch (error) {
            this.logger.error(`Error during battery swap: ${error.message}`);
            throw error;
        }
    }
}
