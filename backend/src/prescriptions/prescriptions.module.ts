import { Module } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsController } from './prescriptions.controller';
import { DatabaseModule } from '../database/database.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [DatabaseModule, RealtimeModule],
  providers: [PrescriptionsService],
  controllers: [PrescriptionsController],
  exports: [PrescriptionsService],
})
export class PrescriptionsModule {}
