import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { PatientPortalController } from './patient-portal.controller';
import { DatabaseModule } from '../database/database.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [DatabaseModule, RealtimeModule],
  providers: [PatientsService],
  controllers: [PatientsController, PatientPortalController],
  exports: [PatientsService],
})
export class PatientsModule {}
