import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PatientStatus } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.patient.findMany({
      where: { deletedAt: null },
      include: {
        appointments: true,
        memberships: true,
        prescriptions: true,
      },
    });
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findFirst({
      where: { id, deletedAt: null },
      include: {
        appointments: true,
        memberships: true,
        prescriptions: true,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient record not found');
    }

    return patient;
  }

  async updateStatus(id: string, status: PatientStatus) {
    const patient = await this.prisma.patient.findFirst({
      where: { id, deletedAt: null },
    });

    if (!patient) {
      throw new NotFoundException('Patient record not found');
    }

    return this.prisma.patient.update({
      where: { id },
      data: { status },
    });
  }

  // ==================================================
  // Patient Portal Operations
  // ==================================================
  async findProfileByUserId(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      include: { user: true },
    });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }
    return patient;
  }

  async updateProfileByUserId(userId: string, dto: UpdateProfileDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    const dob = dto.dob ? new Date(dto.dob) : undefined;

    return this.prisma.patient.update({
      where: { userId },
      data: {
        firstName:
          dto.firstName !== undefined ? dto.firstName : patient.firstName,
        lastName: dto.lastName !== undefined ? dto.lastName : patient.lastName,
        dob: dob !== undefined ? dob : patient.dob,
        gender: dto.gender !== undefined ? dto.gender : patient.gender,
        height: dto.height !== undefined ? dto.height : patient.height,
        weight: dto.weight !== undefined ? dto.weight : patient.weight,
        bloodGroup:
          dto.bloodGroup !== undefined ? dto.bloodGroup : patient.bloodGroup,
        emergencyContact:
          dto.emergencyContact !== undefined
            ? dto.emergencyContact
            : patient.emergencyContact,
        profileImage:
          dto.profileImage !== undefined
            ? dto.profileImage
            : patient.profileImage,
      },
    });
  }

  async getDashboardData(userId: string) {
    const patient = await this.findProfileByUserId(userId);

    // Fetch next upcoming appointment
    const nextAppointment = await this.prisma.appointment.findFirst({
      where: {
        patientId: patient.id,
        status: 'Confirmed',
        deletedAt: null,
      },
      orderBy: { appointmentDate: 'asc' },
      include: { doctor: true },
    });

    // Fetch active prescriptions
    const activePrescriptions = await this.prisma.prescription.findMany({
      where: {
        patientId: patient.id,
        status: 'Active',
        deletedAt: null,
      },
      include: { doctor: true },
    });

    // Fetch active membership
    const activeMembership = await this.prisma.membership.findFirst({
      where: {
        patientId: patient.id,
        status: 'Active',
        deletedAt: null,
      },
      orderBy: { startDate: 'desc' },
    });

    // Calculate BMI live
    const bmi =
      patient.weight && patient.height
        ? parseFloat(
            (patient.weight / (patient.height * patient.height)).toFixed(2),
          )
        : null;

    return {
      profile: {
        firstName: patient.firstName,
        lastName: patient.lastName,
        bmi,
        status: patient.status,
      },
      nextAppointment: nextAppointment
        ? {
            id: nextAppointment.id,
            doctor: `Dr. ${nextAppointment.doctor.firstName} ${nextAppointment.doctor.lastName}`,
            date: nextAppointment.appointmentDate,
            time: nextAppointment.appointmentTime,
            type: nextAppointment.consultationType,
          }
        : null,
      activePrescriptions: activePrescriptions.map((pres) => ({
        id: pres.id,
        doctor: `Dr. ${pres.doctor.firstName} ${pres.doctor.lastName}`,
        medications: pres.medications,
        instructions: pres.instructions,
      })),
      activeMembership: activeMembership
        ? {
            planName: activeMembership.planName,
            expiryDate: activeMembership.expiryDate,
          }
        : null,
    };
  }

  async getPatientAppointments(userId: string) {
    const patient = await this.findProfileByUserId(userId);
    return this.prisma.appointment.findMany({
      where: { patientId: patient.id, deletedAt: null },
      include: { doctor: true },
      orderBy: { appointmentDate: 'desc' },
    });
  }

  async getPatientPrescriptions(userId: string) {
    const patient = await this.findProfileByUserId(userId);
    return this.prisma.prescription.findMany({
      where: { patientId: patient.id, deletedAt: null },
      include: { doctor: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPatientMembership(userId: string) {
    const patient = await this.findProfileByUserId(userId);
    return this.prisma.membership.findMany({
      where: { patientId: patient.id, deletedAt: null },
      orderBy: { startDate: 'desc' },
    });
  }

  async getPatientNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
