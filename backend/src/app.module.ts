import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { AuthModule } from './modules/auth/auth.module';
import { StationsModule } from './modules/stations/stations.module';
import { BatteriesModule } from './modules/batteries/batteries.module';


@Module({
  imports: [DatabaseModule, UsersModule, VehiclesModule, AuthModule, StationsModule, BatteriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
