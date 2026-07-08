import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AppointmentStatus, PrescriptionStatus } from '@prisma/client';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private realtimeService: RealtimeService,
  ) {}

  async findAll() {
    return this.prisma.appointment.findMany({
      where: { deletedAt: null },
      include: {
        patient: true,
        doctor: true,
      },
    });
  }

  async findByPatientUserId(userId: string) {
    return this.prisma.appointment.findMany({
      where: {
        deletedAt: null,
        patient: { userId },
      },
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: { appointmentDate: 'asc' },
    });
  }

  async findByDoctorUserId(userId: string) {
    return this.prisma.appointment.findMany({
      where: {
        deletedAt: null,
        doctor: { userId },
      },
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: { appointmentDate: 'asc' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, deletedAt: null },
      include: {
        patient: true,
        doctor: true,
        prescription: true,
        consultation: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment record not found');
    }

    return appointment;
  }

  async createForUser(
    userId: string,
    doctorId: string,
    appointmentDate: string,
    appointmentTime: string,
    consultationType: string,
  ) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException(
        'Patient profile not found. Please complete registration.',
      );
    }

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    const appointment = await this.prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId,
        appointmentDate,
        appointmentTime,
        consultationType,
        status: AppointmentStatus.Pending,
        createdBy: userId,
      },
    });

    if (doctor && doctor.userId) {
      await this.prisma.notification.create({
        data: {
          userId: doctor.userId,
          title: 'New Appointment Booked',
          message: `Patient ${patient.firstName} ${patient.lastName} has booked a ${consultationType} consultation on ${appointmentDate} at ${appointmentTime}.`,
          type: 'appointment',
        },
      });
    }

    return appointment;
  }

  async create(
    patientId: string,
    doctorId: string,
    appointmentDate: string,
    appointmentTime: string,
    consultationType: string,
    createdBy?: string,
  ) {
    return this.prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        appointmentDate,
        appointmentTime,
        consultationType,
        status: AppointmentStatus.Pending,
        createdBy,
      },
    });
  }

  async reschedule(
    id: string,
    appointmentDate: string,
    appointmentTime: string,
    updatedBy?: string,
  ) {
    const appointment = await this.findOne(id);
    return this.prisma.appointment.update({
      where: { id },
      data: {
        appointmentDate,
        appointmentTime,
        updatedBy,
      },
    });
  }

  async updateMeetingLink(id: string, meetingLink: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: { meetingLink },
    });
  }

  async getMessages(appointmentId: string) {
    return this.prisma.message.findMany({
      where: { appointmentId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, role: true },
        },
      },
    });
  }

  async createMessage(appointmentId: string, senderId: string, text: string) {
    return this.prisma.message.create({
      data: {
        appointmentId,
        senderId,
        text,
      },
      include: {
        sender: {
          select: { id: true, role: true },
        },
      },
    });
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
    updatedBy?: string,
  ) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, deletedAt: null },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment record not found');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status, updatedBy },
    });
  }

  async softDelete(id: string, updatedBy?: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, deletedAt: null },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment record not found');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy },
    });
  }

  async completeConsultation(id: string, doctorUserId: string, data: any) {
    // 1. Validate fields
    const {
      chiefComplaint,
      diagnosis,
      clinicalFindings,
      treatmentRecommendation,
      medications,
      instructions,
      lifestyleAdvice,
      dietRecommendation,
      exerciseRecommendation,
      followUpDate,
      additionalNotes,
    } = data;

    if (
      !chiefComplaint ||
      !diagnosis ||
      !clinicalFindings ||
      !treatmentRecommendation
    ) {
      throw new BadRequestException(
        'Required fields missing: chiefComplaint, diagnosis, clinicalFindings, treatmentRecommendation',
      );
    }

    const validRecommendations = [
      'Approved for Treatment',
      'Requires Further Evaluation',
      'Treatment Rejected',
    ];
    if (!validRecommendations.includes(treatmentRecommendation)) {
      throw new BadRequestException(
        `Invalid treatmentRecommendation. Must be one of: ${validRecommendations.join(', ')}`,
      );
    }

    // 2. Run in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Find appointment
      const appointment = await tx.appointment.findFirst({
        where: { id, deletedAt: null },
        include: {
          patient: { include: { user: true } },
          doctor: { include: { user: true } },
        },
      });

      if (!appointment) {
        throw new NotFoundException('Appointment record not found');
      }

      if (appointment.status === AppointmentStatus.Completed) {
        throw new BadRequestException('Consultation is already completed');
      }

      // Verify assigned doctor
      if (appointment.doctor.userId !== doctorUserId) {
        throw new BadRequestException(
          'Only the assigned doctor can complete this consultation',
        );
      }

      // Check if consultation details already exist
      const existingConsultation = await tx.consultation.findUnique({
        where: { appointmentId: id },
      });
      if (existingConsultation) {
        throw new BadRequestException('Consultation report already submitted');
      }

      // A. Create Consultation Report
      const consultation = await tx.consultation.create({
        data: {
          appointmentId: id,
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          chiefComplaint,
          diagnosis,
          clinicalFindings,
          treatmentRecommendation,
          lifestyleAdvice,
          dietRecommendation,
          exerciseRecommendation,
          followUpDate: followUpDate ? new Date(followUpDate) : null,
          additionalNotes,
        },
      });

      // B. Create Prescription (if medications provided, or default empty active prescription)
      const prescription = await tx.prescription.create({
        data: {
          appointmentId: id,
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          diagnosis,
          medications: medications || '',
          instructions: instructions || '',
          followUpDate: followUpDate ? new Date(followUpDate) : null,
          status: PrescriptionStatus.Active,
          createdBy: doctorUserId,
        },
      });

      // C. Update Appointment Status
      const updatedAppointment = await tx.appointment.update({
        where: { id },
        data: {
          status: AppointmentStatus.Completed,
          updatedBy: doctorUserId,
        },
      });

      // D. Create notifications
      const userNotifications = [];

      // Patient Notifications
      userNotifications.push(
        tx.notification.create({
          data: {
            userId: appointment.patient.userId,
            title: 'Consultation Completed',
            message: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} has completed your consultation and submitted the clinical report.`,
            type: 'consultation',
          },
        }),
        tx.notification.create({
          data: {
            userId: appointment.patient.userId,
            title: 'Prescription Issued',
            message: `A new prescription has been generated for you by Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}.`,
            type: 'prescription',
          },
        }),
      );

      if (treatmentRecommendation === 'Approved for Treatment') {
        userNotifications.push(
          tx.notification.create({
            data: {
              userId: appointment.patient.userId,
              title: 'Treatment Approved',
              message:
                'Congratulations! Your clinical treatment plan has been approved. You are now eligible to buy prescribed medications.',
              type: 'treatment',
            },
          }),
          tx.notification.create({
            data: {
              userId: appointment.patient.userId,
              title: 'Medicines Available',
              message:
                'Your prescribed medicines are available in your queue for checkout.',
              type: 'order_status',
            },
          }),
        );
      }

      // Doctor notification
      userNotifications.push(
        tx.notification.create({
          data: {
            userId: doctorUserId,
            title: 'Consultation Completed Successfully',
            message: `You have successfully completed the consultation and clinical report for patient ${appointment.patient.firstName} ${appointment.patient.lastName}.`,
            type: 'consultation',
          },
        }),
      );

      // Admin notification (Find admin user, or just generic notifications log)
      const admins = await tx.user.findMany({
        where: { role: 'Admin', deletedAt: null },
      });
      for (const admin of admins) {
        userNotifications.push(
          tx.notification.create({
            data: {
              userId: admin.id,
              title: 'Consultation Completed Platform-Wide',
              message: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} completed consultation for patient ${appointment.patient.firstName} ${appointment.patient.lastName}.`,
              type: 'admin_alert',
            },
          }),
        );
      }

      await Promise.all(userNotifications);

      // E. Write Audit Log
      await tx.auditLog.create({
        data: {
          userId: doctorUserId,
          action: 'CONSULTATION_COMPLETED',
          details: `Appointment ID: ${id}, Doctor ID: ${appointment.doctorId}, Patient ID: ${appointment.patientId}, Recommendation: ${treatmentRecommendation}`,
        },
      });

      // F. Emit Realtime Events via SSE Broadcaster
      // Since it's inside the transaction but we want to emit only if successful,
      // NestJS will run this inside transaction scope.
      // But we can trigger emit immediately after the transaction finishes or directly.
      // We will do it in a setTimeout/deferred block so it runs after transaction finishes committing.
      setTimeout(() => {
        // Emit events
        this.realtimeService.emit('consultation.completed', {
          appointmentId: id,
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
        });
        this.realtimeService.emit('prescription.generated', {
          prescriptionId: prescription.id,
          patientId: appointment.patientId,
        });

        if (treatmentRecommendation === 'Approved for Treatment') {
          this.realtimeService.emit('treatment.approved', {
            patientId: appointment.patientId,
          });
          this.realtimeService.emit('medicine.eligible', {
            patientId: appointment.patientId,
          });
        }

        // Dynamic dashboard refresh trigger events
        // Broadcast patient/doctor specific updates
        this.realtimeService.emit('patient.updated', {
          targetUserId: appointment.patient.userId,
          patientId: appointment.patientId,
        });
        this.realtimeService.emit('doctor.updated', {
          targetUserId: appointment.doctor.userId,
          doctorId: appointment.doctorId,
        });
        this.realtimeService.emit('admin.updated', { role: 'Admin' });
      }, 50);

      return {
        appointment: updatedAppointment,
        consultation,
        prescription,
      };
    });
  }
}
