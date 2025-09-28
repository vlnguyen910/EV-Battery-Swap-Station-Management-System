import { Module } from '@nestjs/common';
import { ChangingStationsService } from './changing-stations.service';
import { ChangingStationsController } from './changing-stations.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ChangingStationsController],
  providers: [ChangingStationsService],
  exports: [ChangingStationsService],
})
export class ChangingStationsModule {}
