import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PrescriptionStatus } from '@prisma/client';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class PrescriptionsService {
  constructor(
    private prisma: PrismaService,
    private realtimeService: RealtimeService,
  ) {}

  async findAll() {
    return this.prisma.prescription.findMany({
      where: { deletedAt: null },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });
  }

  async findOne(id: string) {
    const prescription = await this.prisma.prescription.findFirst({
      where: { id, deletedAt: null },
      include: { patient: { include: { user: true } }, doctor: { include: { user: true } } },
    });
    if (!prescription) {
      throw new NotFoundException('Prescription record not found');
    }
    return prescription;
  }

  async create(
    patientId: string,
    doctorId: string,
    appointmentId: string | null,
    diagnosis: string,
    medications: string,
    instructions: string,
    followUpDate: Date | null,
    createdBy?: string,
  ) {
    const prescription = await this.prisma.prescription.create({
      data: {
        patientId,
        doctorId,
        appointmentId,
        diagnosis,
        medications,
        instructions,
        followUpDate,
        status: PrescriptionStatus.Active,
        createdBy,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      }
    });

    this.realtimeService.emit('prescription.new', { prescription });
    
    return prescription;
  }

  async update(
    id: string,
    diagnosis: string,
    medications: string,
    instructions: string,
    followUpDate: Date | null,
    updatedBy?: string,
  ) {
    const prescription = await this.prisma.prescription.findFirst({
      where: { id, deletedAt: null },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription record not found');
    }

    return this.prisma.prescription.update({
      where: { id },
      data: {
        diagnosis,
        medications,
        instructions,
        followUpDate,
        updatedBy,
      },
    });
  }

  async updateStatus(
    id: string,
    status: PrescriptionStatus,
    updatedBy?: string,
  ) {
    const prescription = await this.prisma.prescription.findFirst({
      where: { id, deletedAt: null },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription record not found');
    }

    return this.prisma.prescription.update({
      where: { id },
      data: { status, updatedBy },
    });
  }

  async softDelete(id: string, updatedBy?: string) {
    const prescription = await this.prisma.prescription.findFirst({
      where: { id, deletedAt: null },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription record not found');
    }

    return this.prisma.prescription.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy },
    });
  }
}
