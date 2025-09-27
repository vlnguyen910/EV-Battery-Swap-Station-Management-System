import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { AuthModule } from './modules/auth/auth.module';
import { BatteryServicePackagesModule } from './modules/battery-service-packages/battery-service-packages.module';
import { ChangingStationsModule } from './modules/changing-stations/changing-stations.module';

@Module({
  imports: [DatabaseModule, UsersModule, VehiclesModule, AuthModule, BatteryServicePackagesModule, ChangingStationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
