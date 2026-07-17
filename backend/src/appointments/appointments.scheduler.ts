import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../database/prisma.service';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class AppointmentsScheduler {
  private readonly logger = new Logger(AppointmentsScheduler.name);

  constructor(
    private prisma: PrismaService,
    private realtimeService: RealtimeService,
  ) {}

  @Cron('0 * * * * *') // Runs every minute for testing/precision
  async handleUpcomingAppointments() {
    this.logger.log('Running upcoming appointments check...');
    
    // Format today's date exactly as stored (e.g. "July 12, 2026")
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric' });

    const appointments = await this.prisma.appointment.findMany({
      where: {
        appointmentDate: dateStr,
        status: {
          notIn: ['Cancelled', 'NoShow', 'Completed']
        }
      },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true
          }
        }
      }
    });

    for (const appt of appointments) {
      try {
        // Simple parser since 'date-fns' might not be installed
        const [time, period] = appt.appointmentTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        const apptTime = new Date(now);
        apptTime.setHours(hours, minutes, 0, 0);
        
        // Difference in minutes
        const diffMs = apptTime.getTime() - now.getTime();
        const diffMins = Math.floor(diffMs / 1000 / 60);

        // Alert at 60m, 50m, 40m, 30m, 20m, 10m exactly
        if (diffMins > 0 && diffMins <= 60 && diffMins % 10 === 0) {
          this.logger.log(`Appointment ${appt.id} is in ${diffMins} minutes. Alerting patient.`);
          
          const doctorName = appt.doctor.lastName ? `Dr. ${appt.doctor.lastName}` : `Dr. ${appt.doctor.firstName || 'Doctor'}`;
          
          // Store notification in DB
          const notification = await this.prisma.notification.create({
            data: {
              userId: appt.patient.userId,
              title: 'Upcoming Consultation Alert',
              message: `Your consultation with ${doctorName} starts in ${diffMins} minutes. Please be ready to join!`,
              type: 'Alert',
              isRead: false
            }
          });

          // Emit real-time event
          this.realtimeService.emitToUser(appt.patient.userId, 'notification', { notification });
        }
      } catch (err) {
        this.logger.error(`Failed to process appointment ${appt.id}: ${err.message}`);
      }
    }
  }
}
