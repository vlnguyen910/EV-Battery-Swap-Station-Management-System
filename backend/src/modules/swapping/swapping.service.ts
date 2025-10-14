import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SwappingDto } from './dto/swapping.dto';
import { UsersService } from '../users/users.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { BatteriesService } from '../batteries/batteries.service';
import { StationsService } from '../stations/stations.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
@Injectable()
export class SwappingService {
    constructor(
        private usersService: UsersService,
        private vehiclesService: VehiclesService,
        private stationsService: StationsService,
        private batteriesService: BatteriesService,
        private subscriptionsService: SubscriptionsService,
    ) { }

    private readonly logger = new Logger(SwappingService.name);

    async swapBatteries(swapDto: SwappingDto) {
        const { user_id, vehicle_id, station_id, return_battery_id } = swapDto;

        // Validate user
        const user = await this.usersService.findOneById(user_id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const vehicle = await this.vehiclesService.findOneActiveByUserId(user_id);
        if (!vehicle) {
            throw new NotFoundException('Vehicle not found');
        }
        if (vehicle.vehicle_id !== vehicle_id) {
            throw new BadRequestException(`Vehicle with ID ${vehicle_id} does not belong to user ${user_id}`);
        }

        // Validate station
        const station = await this.stationsService.findOne(station_id);
        if (!station) {
            throw new NotFoundException('Station not found');
        }

        // Validate return battery
        const returnBattery = await this.batteriesService.findOne(return_battery_id);
        if (!returnBattery) {
            throw new NotFoundException('Return battery not found');
        }


        //check user is subcribed to any package
        const activeSubscription = await this.subscriptionsService.findActiveByUser(user_id);
        if (!activeSubscription) {
            throw new NotFoundException('User does not have an active subscription for this vehicle');
        }

        // Validate return battery in user package
        if (vehicle.battery_id !== return_battery_id) {
            throw new BadRequestException('Return battery does not match the vehicle\'s current battery');
        }

        //Update battery inventory and user-package


        //create swapping record
        //check is user have resservation and update it
    }
}
