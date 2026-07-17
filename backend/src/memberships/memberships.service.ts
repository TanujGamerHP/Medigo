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

  async subscribe(userId: string, dto: SubscribeDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found.');
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
