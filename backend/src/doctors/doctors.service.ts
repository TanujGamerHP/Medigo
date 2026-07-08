import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DoctorStatus } from '@prisma/client';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.doctor.findMany({
      where: { deletedAt: null },
      include: { user: true },
    });
  }

  async findOne(id: string) {
    const doctor = await this.prisma.doctor.findFirst({
      where: { id, deletedAt: null },
      include: { user: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor record not found');
    }

    return doctor;
  }

  async updateStatus(id: string, status: DoctorStatus) {
    const doctor = await this.prisma.doctor.findFirst({
      where: { id, deletedAt: null },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor record not found');
    }

    return this.prisma.doctor.update({
      where: { id },
      data: { status },
    });
  }

  async getAvailability() {
    const doctors = await this.findAll();
    return doctors.map((doc) => ({
      doctorId: doc.id,
      name: `Dr. ${doc.firstName} ${doc.lastName}`,
      specialization: doc.specialization,
      availabilityStatus: doc.availabilityStatus,
      weeklyHours: [
        { day: 'Monday', slots: ['09:00 - 12:00', '14:00 - 17:00'] },
        { day: 'Wednesday', slots: ['10:00 - 13:00', '15:00 - 18:00'] },
        { day: 'Friday', slots: ['09:00 - 12:00', '13:00 - 16:00'] },
      ],
    }));
  }

  // ==================================================
  // Doctor Portal / Dashboard Operations
  // ==================================================
  async findProfileByUserId(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      include: { user: true },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }
    return doctor;
  }

  async getDashboardData(userId: string) {
    const doctor = await this.findProfileByUserId(userId);

    const appointmentsCount = await this.prisma.appointment.count({
      where: { doctorId: doctor.id, deletedAt: null },
    });

    const pendingAppointments = await this.prisma.appointment.count({
      where: { doctorId: doctor.id, status: 'Pending', deletedAt: null },
    });

    // Upcoming consultation list
    const upcoming = await this.prisma.appointment.findMany({
      where: { doctorId: doctor.id, deletedAt: null },
      take: 5,
      orderBy: { appointmentDate: 'asc' },
      include: { patient: true },
    });

    return {
      profile: {
        name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        specialization: doctor.specialization,
        availabilityStatus: doctor.availabilityStatus,
        status: doctor.status,
      },
      metrics: {
        totalAppointments: appointmentsCount,
        pendingApprovals: pendingAppointments,
        allTimeRevenue: appointmentsCount * (doctor.consultationFee || 0),
        monthlyRevenue: appointmentsCount * (doctor.consultationFee || 0), // Simplified to total for now
      },
      upcomingConsultations: upcoming.map((app) => ({
        id: app.id,
        patientName: `${app.patient.firstName} ${app.patient.lastName}`,
        date: app.appointmentDate,
        time: app.appointmentTime,
        status: app.status,
      })),
    };
  }

  async getDoctorAppointments(userId: string) {
    const doctor = await this.findProfileByUserId(userId);
    return this.prisma.appointment.findMany({
      where: { doctorId: doctor.id, deletedAt: null },
      include: { patient: true },
      orderBy: { appointmentDate: 'desc' },
    });
  }

  async getDoctorPatients(userId: string) {
    const doctor = await this.findProfileByUserId(userId);
    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId: doctor.id, deletedAt: null },
      select: { patientId: true },
    });

    const patientIds = Array.from(
      new Set(appointments.map((a) => a.patientId)),
    );

    return this.prisma.patient.findMany({
      where: {
        id: { in: patientIds },
        deletedAt: null,
      },
    });
  }

  async getDoctorPatientDetails(userId: string, patientId: string) {
    const doctor = await this.findProfileByUserId(userId);
    const patient = await this.prisma.patient.findFirst({
      where: { id: patientId, deletedAt: null },
      include: {
        appointments: {
          where: { deletedAt: null },
          include: {
            consultation: true,
            prescription: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        prescriptions: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
        assessments: {
          where: { deletedAt: null },
          orderBy: { submittedAt: 'desc' },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient record not found');
    }

    return patient;
  }

  async updateAvailability(userId: string, availabilityStatus: string) {
    const doctor = await this.findProfileByUserId(userId);
    return this.prisma.doctor.update({
      where: { id: doctor.id },
      data: { availabilityStatus },
    });
  }

  async updateProfile(userId: string, data: any) {
    const doctor = await this.findProfileByUserId(userId);
    return this.prisma.doctor.update({
      where: { id: doctor.id },
      data: {
        specialization: data.specialization,
        qualification: data.qualification,
        experience: data.experience,
        consultationFee: data.consultationFee
          ? parseFloat(data.consultationFee)
          : undefined,
      },
    });
  }
}
