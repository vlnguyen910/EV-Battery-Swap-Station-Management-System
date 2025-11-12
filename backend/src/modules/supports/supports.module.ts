import { Module } from '@nestjs/common';
import { SupportsService } from './supports.service';
import { SupportsController } from './supports.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SupportsController],
  providers: [SupportsService],
  exports: [SupportsService],
})
export class SupportsModule {}
