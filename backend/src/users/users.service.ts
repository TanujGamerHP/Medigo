import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        patient: {
          include: {
            memberships: true,
          },
        },
        doctor: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User account not found');
    }

    return user;
  }

  async updateProfile(id: string, updateData: any) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User account not found');
    }

    // Common fields
    if (updateData.phone !== undefined) {
      await this.prisma.user.update({
        where: { id },
        data: { phone: updateData.phone },
      });
    }

    if (user.role === 'Patient') {
      const patientData: any = {};
      if (updateData.firstName) patientData.firstName = updateData.firstName;
      if (updateData.lastName) patientData.lastName = updateData.lastName;
      if (updateData.dob) patientData.dob = new Date(updateData.dob);
      if (updateData.gender) patientData.gender = updateData.gender;
      if (updateData.height) patientData.height = parseFloat(updateData.height);
      if (updateData.weight) patientData.weight = parseFloat(updateData.weight);
      if (updateData.profileImage)
        patientData.profileImage = updateData.profileImage;

      await this.prisma.patient.upsert({
        where: { userId: id },
        update: patientData,
        create: {
          userId: id,
          firstName: updateData.firstName || '',
          lastName: updateData.lastName || '',
          ...patientData,
        },
      });
    } else if (user.role === 'Doctor') {
      const doctorData: any = {};
      if (updateData.firstName !== undefined)
        doctorData.firstName = updateData.firstName;
      if (updateData.lastName !== undefined)
        doctorData.lastName = updateData.lastName;
      if (updateData.specialization !== undefined)
        doctorData.specialization = updateData.specialization;
      if (updateData.experience !== undefined)
        doctorData.experience = updateData.experience;
      if (updateData.profileImage !== undefined)
        doctorData.profileImage = updateData.profileImage;
      if (updateData.consultationFee !== undefined)
        doctorData.consultationFee = parseFloat(updateData.consultationFee);
      if (updateData.bankName !== undefined)
        doctorData.bankName = updateData.bankName;
      if (updateData.accountNumber !== undefined)
        doctorData.accountNumber = updateData.accountNumber;
      if (updateData.ifscCode !== undefined)
        doctorData.ifscCode = updateData.ifscCode;

      await this.prisma.doctor.upsert({
        where: { userId: id },
        update: doctorData,
        create: {
          userId: id,
          firstName: updateData.firstName || '',
          lastName: updateData.lastName || '',
          specialization: updateData.specialization || 'General',
          experience: updateData.experience || '0 years',
          ...doctorData,
        },
      });
    }

    return this.findOne(id);
  }

  async purchaseMembership(userId: string, planName: string, price: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, patient: true },
    });

    if (!user || user.role !== 'Patient' || !user.patient) {
      throw new NotFoundException('Patient account not found');
    }

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    await this.prisma.membership.create({
      data: {
        patientId: user.patient.id,
        planName,
        price,
        startDate,
        expiryDate,
        status: 'Active',
      },
    });

    return this.findOne(userId);
  }
}
