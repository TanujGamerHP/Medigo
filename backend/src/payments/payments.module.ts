import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { AppointmentsModule } from '../appointments/appointments.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [AppointmentsModule, NotificationsModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
