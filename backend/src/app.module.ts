import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { AuthModule } from './modules/auth/auth.module';
import { BatteryServicePackagesModule } from './modules/battery-service-packages/battery-service-packages.module';

@Module({
  imports: [DatabaseModule, UsersModule, VehiclesModule, AuthModule, BatteryServicePackagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
