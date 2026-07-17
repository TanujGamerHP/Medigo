import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DoctorStatus } from '@prisma/client';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class DoctorsService {
  constructor(
    private prisma: PrismaService,
    private realtimeService: RealtimeService,
  ) {}

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

  async getMyPatients(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
    });
    
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const connections = await this.prisma.doctorPatientConnection.findMany({
      where: {
        doctorId: doctor.id,
        status: 'Active',
      },
      include: {
        patient: {
          include: {
            user: true,
            memberships: true,
          }
        }
      }
    });

    return connections.map(conn => conn.patient);
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

    const allAppointments = await this.prisma.appointment.findMany({
      where: { doctorId: doctor.id, deletedAt: null },
      include: { patient: true },
    });

    const todayStr = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric' });

    const todayAppointmentsCount = allAppointments.filter(app => app.appointmentDate === todayStr).length;

    const pendingAppointments = allAppointments.filter(app => app.status === 'Pending').length;

    // Upcoming consultation list - properly sorted by date
    const upcoming = allAppointments
      .filter(app => ['Pending', 'Confirmed'].includes(app.status))
      .sort((a, b) => new Date(`${a.appointmentDate} ${a.appointmentTime}`).getTime() - new Date(`${b.appointmentDate} ${b.appointmentTime}`).getTime())
      .slice(0, 5);

    return {
      profile: {
        name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        specialization: doctor.specialization,
        availabilityStatus: doctor.availabilityStatus,
        status: doctor.status,
      },
      metrics: {
        totalAppointments: todayAppointmentsCount,
        pendingApprovals: pendingAppointments,
        allTimeRevenue: allAppointments.length * (doctor.consultationFee || 0),
        monthlyRevenue: todayAppointmentsCount * (doctor.consultationFee || 0), // Ideally should be monthly, leaving as today's for now or we can filter by current month
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

  async getDoctorPatientsAssessments(userId: string) {
    const doctor = await this.findProfileByUserId(userId);
    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId: doctor.id, deletedAt: null },
      select: { patientId: true },
    });
    const connections = await this.prisma.doctorPatientConnection.findMany({
      where: { doctorId: doctor.id, status: 'Active' },
      select: { patientId: true },
    });
    
    const patientIds = new Set([
      ...appointments.map(a => a.patientId),
      ...connections.map(c => c.patientId)
    ]);

    return this.prisma.assessment.findMany({
      where: {
        patientId: { in: Array.from(patientIds) },
        deletedAt: null,
      },
      include: {
        patient: true,
      },
      orderBy: { submittedAt: 'desc' },
      distinct: ['patientId'],
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
    const updated = await this.prisma.doctor.update({
      where: { id: doctor.id },
      data: {
        specialization: data.specialization,
        qualification: data.qualification,
        experience: data.experience,
        consultationFee: data.consultationFee
          ? parseFloat(data.consultationFee)
          : undefined,
      },
      include: {
        user: true,
      }
    });

    this.realtimeService.emit('doctor.updated', { doctor: updated });
    return updated;
  }

  async getAvailableSlots(doctorId: string) {
    const doctor = await this.prisma.doctor.findFirst({
      where: { id: doctorId, deletedAt: null },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor record not found');
    }

    // Generate slots for the next 7 days
    const slots: Record<string, string[]> = {};
    const today = new Date();
    // Use dates formatted exactly like the database expects them for appointments
    // We will generate 9:00 AM, 10:00 AM, 11:00 AM, 1:00 PM, 2:00 PM, 3:00 PM, 4:00 PM
    const dailySlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric' });
      slots[dateStr] = [...dailySlots];
    }

    const dateKeys = Object.keys(slots);
    const startDate = dateKeys[0];
    const endDate = dateKeys[dateKeys.length - 1];

    // Fetch existing appointments for this doctor in this date range
    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: {
          in: dateKeys
        },
        status: {
          notIn: ['Cancelled', 'NoShow']
        }
      },
      select: {
        appointmentDate: true,
        appointmentTime: true
      }
    });

    // Remove booked slots
    for (const appt of appointments) {
      if (slots[appt.appointmentDate]) {
        slots[appt.appointmentDate] = slots[appt.appointmentDate].filter(
          (time) => time !== appt.appointmentTime
        );
      }
    }

    return slots;
  }
}
