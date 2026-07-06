import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PrescriptionStatus } from '@prisma/client';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.prescription.findMany({
      where: { deletedAt: null },
      include: {
        patient: true,
        doctor: true,
      },
    });
  }

  async findOne(id: string) {
    const prescription = await this.prisma.prescription.findFirst({
      where: { id, deletedAt: null },
      include: { patient: true, doctor: true },
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
    return this.prisma.prescription.create({
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
    });
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

  async updateStatus(id: string, status: PrescriptionStatus, updatedBy?: string) {
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
