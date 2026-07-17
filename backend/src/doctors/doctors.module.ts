import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DoctorDashboardController } from './doctor-dashboard.controller';
import { DatabaseModule } from '../database/database.module';
import { PrescriptionsModule } from '../prescriptions/prescriptions.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [DatabaseModule, PrescriptionsModule, RealtimeModule],
  providers: [DoctorsService],
  controllers: [DoctorsController, DoctorDashboardController],
  exports: [DoctorsService],
})
export class DoctorsModule {}
