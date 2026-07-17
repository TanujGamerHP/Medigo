import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DoctorPatientGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // If the user is not a Doctor, this guard does not apply.
    // We let the standard RolesGuard handle permissions for Patients, Admins, etc.
    if (!user || user.role !== 'Doctor') {
      return true;
    }

    // Try to extract patientId from params or body
    const patientId = request.params?.patientId || request.params?.id || request.body?.patientId;

    if (!patientId) {
      // If there's no patientId specified in the route, we can't restrict it, 
      // or we can reject it depending on strictness. We'll allow it assuming 
      // the controller handles generic lists (which should be filtered by doctorId anyway).
      return true;
    }

    // Look up the doctor ID using the user.sub (which is the user's ID)
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId: user.sub },
      select: { id: true },
    });

    if (!doctor) {
      throw new ForbiddenException('Doctor profile not found.');
    }

    const connection = await this.prisma.doctorPatientConnection.findUnique({
      where: {
        doctorId_patientId: {
          doctorId: doctor.id,
          patientId: patientId,
        },
      },
    });

    if (!connection || connection.status !== 'Active') {
      const hasAppointment = await this.prisma.appointment.findFirst({
        where: {
          doctorId: doctor.id,
          patientId: patientId,
          deletedAt: null,
        },
      });

      if (!hasAppointment) {
        throw new ForbiddenException("You are not authorized to view this patient's records.");
      }
    }

    return true;
  }
}
