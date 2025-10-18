import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SwappingDto } from './dto/swapping.dto';
import { UsersService } from '../users/users.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { BatteriesService } from '../batteries/batteries.service';
import { StationsService } from '../stations/stations.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { DatabaseService } from '../database/database.service';
import { SwapTransactionsService } from '../swap-transactions/swap-transactions.service';
import { SwapTransactionStatus } from '@prisma/client';
import { FirstSwapDto } from './dto/first-swap.dto';
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
        const { user_id, station_id } = swapDto;

        try {
            // Check user is exist
            const user = await this.usersService.findOneById(user_id);
            if (!user) {
                this.logger.warn(`User with ID ${user_id} not found`);
                throw new NotFoundException(`User with ID ${user_id} not found`);
            }

            // Check station is exist
            const station = await this.stationsService.findOne(station_id);
            if (!station) {
                this.logger.warn(`Station with ID ${station_id} not found`);
                throw new NotFoundException(`Station with ID ${station_id} not found`);
            }

            // Check vehicle is exist
            const vehicle = await this.vehiclesService.findOneActiveByUserId(user_id);
            if (!vehicle) {
                this.logger.warn(`Active vehicle for user ID ${user_id} not found`);
                throw new NotFoundException(`Active vehicle for user ID ${user_id} not found`);
            }

            // Get vehicle id and return battery id from vehicle
            const vehicle_id = vehicle.vehicle_id;
            const return_battery_id = vehicle.battery_id;

            // Check user subscription is valid
            const subscription = await this.subscriptionsService.findOneActiveByVehicleId(vehicle_id);
            if (!subscription) {
                this.logger.warn(`No active subscription found for vehicle ID ${vehicle_id} `);
                throw new NotFoundException(`No active subscription found for vehicle ID ${vehicle_id} `);
            }

            const takenBatteryId = await this.batteriesService.findBestBatteryForVehicle(vehicle_id, station_id);
            if (!takenBatteryId) {
                this.logger.warn(`No suitable battery available at station ID ${station_id} for vehicle ID ${vehicle_id}`);
                throw new NotFoundException(`No suitable battery available at station ID ${station_id} for vehicle ID ${vehicle_id}`);
            }


            if (!return_battery_id) {
                this.logger.warn(`Vehicle ID ${vehicle_id} does not have a battery to return`);
                this.logger.warn(`Initializing battery instead for user ID ${user_id}`);
                const firstSwapDto: FirstSwapDto = {
                    user_id,
                    station_id,
                    vehicle_id,
                    taken_battery_id: takenBatteryId.battery_id,
                    subscription_id: subscription.subscription_id,
                };
                return await this.initializeBattery(firstSwapDto);
            }


            // Perform the swap within a transaction
            return await this.databaseService.$transaction(async (prisma) => {
                await this.batteriesService.returnBatteryToStation(return_battery_id, station_id, prisma);
                await this.batteriesService.assignBatteryToVehicle(takenBatteryId.battery_id, vehicle_id, prisma);
                await this.vehiclesService.updateBatteryId(vehicle_id, takenBatteryId.battery_id, prisma);
                await this.subscriptionsService.incrementSwapUsed(subscription.subscription_id, prisma);
                //Create swap transaction 

                const swapRecord = await this.swapTransactionsService.create({
                    user_id,
                    vehicle_id,
                    station_id,
                    battery_taken_id: takenBatteryId.battery_id,
                    battery_returned_id: return_battery_id,
                    subscription_id: subscription.subscription_id,
                    status: SwapTransactionStatus.completed,
                }, prisma);

                return {
                    message: 'Battery swap successful',
                    swap_used: subscription.swap_used,
                    swapTransaction: swapRecord
                }
            });

        } catch (error) {
            this.logger.error(`Error during battery swap: ${error.message}`);
            throw error;
        }
    }

    async initializeBattery(firstSwapDto: FirstSwapDto) {
        const { user_id, station_id, vehicle_id, taken_battery_id, subscription_id } = firstSwapDto;
        try {


            return await this.databaseService.$transaction(async (prisma) => {
                await this.batteriesService.assignBatteryToVehicle(taken_battery_id, vehicle_id, prisma);
                await this.vehiclesService.updateBatteryId(vehicle_id, taken_battery_id, prisma);
                //Create swap transaction 

                const swapRecord = await this.swapTransactionsService.create({
                    user_id,
                    vehicle_id,
                    station_id,
                    battery_taken_id: taken_battery_id,
                    subscription_id: subscription_id,
                    status: SwapTransactionStatus.completed,
                }, prisma);

                return {
                    message: 'Battery initialization successful',
                    swapTransaction: swapRecord
                }
            });
        } catch (error) {
            this.logger.error(`Error during battery initialization: ${error.message}`);
            throw error;
        }
    }
}
