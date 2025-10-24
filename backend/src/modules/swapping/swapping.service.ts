import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SwappingDto } from './dto/swapping.dto';
import { UsersService } from '../users/users.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { BatteriesService } from '../batteries/batteries.service';
import { StationsService } from '../stations/stations.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { DatabaseService } from '../database/database.service';
import { SwapTransactionsService } from '../swap-transactions/swap-transactions.service';
import { BatteryStatus, ReservationStatus, SwapTransactionStatus } from '@prisma/client';
import { FirstSwapDto } from './dto/first-swap.dto';
import { ReservationsService } from '../reservations/reservations.service';
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
        private reservationsService: ReservationsService,
    ) { }

    async swapBatteries(swapDto: SwappingDto) {
        const { user_id, station_id } = swapDto;
        const kmPerPercent: number = 5; // Example: 5 km per 1% battery
        const fullBatteryPercent = 100;


        try {
            // Check user is exist
            const user = await this.usersService.findOneById(user_id);
            if (!user) {
                throw new NotFoundException(`User with ID ${user_id} not found`);
            }

            // Check station is exist
            const station = await this.stationsService.findOne(station_id);
            if (!station) {
                throw new NotFoundException(`Station with ID ${station_id} not found`);
            }

            // Check vehicle is exist
            const vehicle = await this.vehiclesService.findOneActiveByUserId(user_id);
            if (!vehicle) {
                throw new NotFoundException(`Active vehicle for user ID ${user_id} not found`);
            }

            // Get vehicle id and return battery id from vehicle
            const vehicle_id = vehicle.vehicle_id;
            const return_battery_id = vehicle.battery_id;

            // Check user subscription is valid
            const subscription = await this.subscriptionsService.findOneActiveByVehicleId(vehicle_id);
            if (!subscription) {
                throw new NotFoundException(`No active subscription found for vehicle ID ${vehicle_id} `);
            }


            //check is use have reservation at this station
            const reservation = await this.reservationsService.findOneScheduledByUserId(user_id);
            let taken_battery_id: number;
            if (reservation) {
                taken_battery_id = reservation.battery_id;

                //update battery status to full
                await this.batteriesService.updateBatteryStatus(taken_battery_id, BatteryStatus.full);

                if (reservation.station_id !== station_id) {
                    throw new BadRequestException(`Reservation station does not match the swapping station`);
                }

                if (reservation.vehicle_id !== vehicle_id) {
                    throw new BadRequestException(`Reservation vehicle does not match the swapping vehicle`);
                }
            }

            taken_battery_id = (await this.batteriesService.findBestBatteryForVehicle(vehicle_id, station_id)).battery_id;

            // If no return battery, it means it's the first swap, so just assign the taken battery to the vehicle
            if (!return_battery_id) {
                const firstSwapDto: FirstSwapDto = {
                    user_id,
                    station_id,
                    vehicle_id,
                    taken_battery_id: taken_battery_id,
                    subscription_id: subscription.subscription_id,
                    reservation_id: reservation?.reservation_id
                };
                return await this.initializeBattery(firstSwapDto);
            }


            // Perform the swap within a transaction
            return await this.databaseService.$transaction(async (prisma) => {
                await this.batteriesService.returnBatteryToStation(return_battery_id, station_id, prisma);
                await this.batteriesService.assignBatteryToVehicle(taken_battery_id, vehicle_id, prisma);
                await this.vehiclesService.updateBatteryId(vehicle_id, taken_battery_id, prisma);
                await this.subscriptionsService.incrementSwapUsed(subscription.subscription_id, prisma);

                const returnBattery = await this.batteriesService.findOne(return_battery_id);
                const batteryUsedPercent = fullBatteryPercent - returnBattery.current_charge;
                const distanceTraveled = batteryUsedPercent * kmPerPercent;

                // Update distance traveled in subscription
                await this.subscriptionsService.updateDistanceTraveled(
                    subscription.subscription_id,
                    distanceTraveled,
                    prisma
                );

                //Create swap transaction 
                const swapRecord = await this.swapTransactionsService.create({
                    user_id,
                    vehicle_id,
                    station_id,
                    battery_taken_id: taken_battery_id,
                    battery_returned_id: return_battery_id,
                    subscription_id: subscription.subscription_id,
                    status: SwapTransactionStatus.completed,
                }, prisma);

                let reservationStatus = null;
                //If user have reservation, update reservation status to completed
                if (reservation) {
                    reservationStatus = await this.reservationsService.updateReservationStatus(reservation.reservation_id, user_id, ReservationStatus.completed, prisma);
                }

                return {
                    message: 'Battery swap successful',
                    swap_used: subscription.swap_used,
                    batteryUsedPercent: batteryUsedPercent,
                    distance_used: distanceTraveled,
                    distance_traveled: subscription.distance_traveled + distanceTraveled,
                    swapTransaction: swapRecord,
                    reservation_status: reservation ? ReservationStatus.completed : null
                }
            });

        } catch (error) {
            throw error;
        }
    }

    async initializeBattery(firstSwapDto: FirstSwapDto) {
        const { user_id, station_id, vehicle_id, taken_battery_id, reservation_id, subscription_id } = firstSwapDto;
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

                if (reservation_id) {
                    await this.reservationsService.updateReservationStatus(reservation_id, user_id, ReservationStatus.completed, prisma);
                }

                return {
                    message: 'Battery initialization successful',
                    swapTransaction: swapRecord,
                    reservation_status: reservation_id ? ReservationStatus.completed : null
                }
            });
        } catch (error) {
            throw error;
        }
    }
}
