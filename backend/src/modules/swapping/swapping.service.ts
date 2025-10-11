import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SwappingDto } from './dto/swapping.dto';
import { UsersService } from '../users/users.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { BatteriesService } from '../batteries/batteries.service';
import { StationsService } from '../stations/stations.service';
@Injectable()
export class SwappingService {
    constructor(
        private usersService: UsersService,
        private vehiclesService: VehiclesService,
        private batteriesService: BatteriesService,
        private stationsService: StationsService,
    ) { }

    private readonly logger = new Logger(SwappingService.name);

    async swapBatteries(swapDto: SwappingDto) {
        const { user_id, station_id, return_battery_id } = swapDto;

        // Validate user
        const user = await this.usersService.findOneById(user_id);
        if (!user) {
            throw new NotFoundException('User not found');
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
        // Validate return battery in user package
        //Update battery inventory and user-package
        //create swapping record
        //check is user have resservation and update it
    }
}
