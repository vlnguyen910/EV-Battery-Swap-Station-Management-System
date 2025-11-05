import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SwappingDto } from './dto/swapping.dto';
import { UsersService } from '../users/users.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { BatteriesService } from '../batteries/batteries.service';
import { StationsService } from '../stations/stations.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { DatabaseService } from '../database/database.service';
import { SwapTransactionsService } from '../swap-transactions/swap-transactions.service';
import { BatteryStatus, ReservationStatus, SubscriptionStatus, SwapTransactionStatus } from '@prisma/client';
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
        const { user_id, vehicle_id, station_id } = swapDto;
        const KM_PER_PERCENT: number = 5; // Example: 5 km per 1% battery
        const FULL_BATTERY_PERCENT: number = 100;

        try {
            // Check user is exist
            const user = await this.usersService.findOneById(user_id);

            // Check station is exist
            const station = await this.stationsService.findOne(station_id);

            // Check vehicle is exist
            const vehicle = await this.vehiclesService.findOne(vehicle_id);

            // Check user subscription is valid
            const subscription = await this.subscriptionsService.findOneByVehicleId(vehicle_id);
            if (subscription.status === SubscriptionStatus.pending_penalty_payment) {
                throw new BadRequestException('Your subscription is pending penalty payment. Please settle the penalties to proceed with battery swapping.');
            }

            if (subscription.status !== SubscriptionStatus.active) {
                throw new BadRequestException('No active subscription found for this vehicle. Please subscribe to a plan to swap batteries.');
            }

            //check is use have reservation at this station
            const reservation = await this.reservationsService.findOneScheduledByUserId(user_id);
            let taken_battery_id: number;
            if (reservation) {
                taken_battery_id = reservation.battery_id;

                if (reservation.station_id !== station_id) {
                    throw new BadRequestException(`Reservation station does not match the swapping station`);
                }

                if (reservation.vehicle_id === vehicle_id) {
                    taken_battery_id = reservation.battery_id;
                    // Update battery status to full for swapping
                    await this.batteriesService.updateBatteryStatus(taken_battery_id, BatteryStatus.full);
                }
            }
            else {
                taken_battery_id = (await this.batteriesService.findBestBatteryForVehicle(vehicle_id, station_id)).battery_id;
            }

            //get return battery id from vehicle
            const return_battery_id = vehicle.battery_id;

            // If no return battery, it means it's the first swap, so just assign the taken battery to the vehicle
            if (!return_battery_id) {
                const firstSwapDto: FirstSwapDto = {
                    user_id,
                    station_id,
                    vehicle_id,
                    taken_battery_id,
                    subscription_id: subscription.subscription_id,
                    reservation_id: reservation?.reservation_id
                };
                return await this.initializeBattery(firstSwapDto);
            }

            // Perform the swap within a transaction
            return await this.databaseService.$transaction(async (prisma) => {
                //update battery status booked to full for swapping
                await this.batteriesService.updateBatteryStatus(taken_battery_id, BatteryStatus.full, prisma);

                await this.batteriesService.returnBatteryToStation(return_battery_id, station_id, prisma);
                await this.batteriesService.assignBatteryToVehicle(taken_battery_id, vehicle_id, prisma);
                await this.vehiclesService.updateBatteryId(vehicle_id, taken_battery_id, prisma);
                await this.subscriptionsService.incrementSwapUsed(subscription.subscription_id, prisma);

                const returnBattery = await this.batteriesService.findOne(return_battery_id);
                const batteryUsedPercent = FULL_BATTERY_PERCENT - returnBattery.current_charge.toNumber();
                const distanceTraveled = batteryUsedPercent * KM_PER_PERCENT;
                console.log(`Distance traveled in this swap: ${distanceTraveled} km`);

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
                //update battery status booked to full for swapping
                await this.batteriesService.updateBatteryStatus(taken_battery_id, BatteryStatus.full, prisma);

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
