import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { MembershipStatus } from '@prisma/client';

import { DatabaseModule } from '../database/database.module';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MembershipsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async getPlans() {
    return [
      {
        name: 'Starter',
        price: 149.0,
        billing: 'monthly',
        description:
          'Basic access to medical team and GLP-1 intake prescriptions.',
      },
      {
        name: 'Premium',
        price: 299.0,
        billing: 'monthly',
        description:
          'Standard access including live AI coaching and monthly check-ins.',
      },
      {
        name: 'Elite',
        price: 499.0,
        billing: 'monthly',
        description:
          'All-inclusive medical consultations, prioritised clinical response times.',
      },
    ];
  }

  async verifyEligibility(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found.');
    }

    const activeMembership = await this.prisma.membership.findFirst({
      where: {
        patientId: patient.id,
        status: MembershipStatus.Active,
        expiryDate: { gt: new Date() },
      },
      orderBy: { expiryDate: 'desc' },
    });

    if (activeMembership) {
      const d = activeMembership.expiryDate;
      const formattedDate = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
      
      return {
        allowAction: false,
        currentPlan: activeMembership.planName,
        expiryDate: formattedDate,
        message: `You currently have an active ${activeMembership.planName} plan valid until ${formattedDate}. Please wait for your current plan to expire before selecting a new one.`,
      };
    }

    return { allowAction: true };
  }

  async subscribe(userId: string, dto: SubscribeDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found.');
    }

    // 1. CHECK CURRENT STATUS
    const activeMembership = await this.prisma.membership.findFirst({
      where: {
        patientId: patient.id,
        status: MembershipStatus.Active,
        expiryDate: { gt: new Date() },
      },
      orderBy: { expiryDate: 'desc' },
    });

    // 2. ENFORCE LOCKOUT PERIOD
    if (activeMembership) {
      const d = activeMembership.expiryDate;
      const formattedDate = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
      
      // 3. CONSTRUCT RESTRICTION RESPONSE
      return {
        allowAction: false,
        currentPlan: activeMembership.planName,
        expiryDate: formattedDate,
        message: `You currently have an active ${activeMembership.planName} plan valid until ${formattedDate}. Please wait for your current plan to expire before selecting a new one.`,
      };
    }

    const startDate = new Date();
    const expiryDate = new Date();
    
    // Calculate expiry based on plan duration
    if (dto.planName.toLowerCase().includes('3-months')) {
      expiryDate.setMonth(expiryDate.getMonth() + 3);
    } else if (dto.planName.toLowerCase().includes('6-months')) {
      expiryDate.setMonth(expiryDate.getMonth() + 6);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1); // default 30 days active
    }

    const membership = await this.prisma.membership.create({
      data: {
        patientId: patient.id,
        planName: dto.planName,
        price: dto.price,
        startDate,
        expiryDate,
        status: MembershipStatus.Active,
        createdBy: userId,
      },
    });

    await this.notificationsService.createAndEmitNotification(
      userId,
      'Subscription Activated',
      `Your ${dto.planName} has been successfully activated.`,
      'system'
    );

    return membership;
  }

  async getHistory(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found.');
    }

    return this.prisma.membership.findMany({
      where: { patientId: patient.id, deletedAt: null },
      orderBy: { startDate: 'desc' },
    });
  }
}
