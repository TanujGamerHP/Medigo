import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalUsers = await this.prisma.user.count({
      where: { deletedAt: null },
    });
    const totalPatients = await this.prisma.patient.count({
      where: { deletedAt: null },
    });
    const totalDoctors = await this.prisma.doctor.count({
      where: { status: 'Verified', deletedAt: null },
    });
    const pendingDoctors = await this.prisma.doctor.count({
      where: { status: 'PendingCredentials', deletedAt: null },
    });
    const totalAppointments = await this.prisma.appointment.count({
      where: { deletedAt: null },
    });

    // Realtime counts for completion metrics
    const completedConsultations = await this.prisma.appointment.count({
      where: { status: 'Completed', deletedAt: null },
    });
    const prescriptionsIssued = await this.prisma.prescription.count({
      where: { deletedAt: null },
    });
    const approvedTreatments = await this.prisma.consultation.count({
      where: { treatmentRecommendation: 'Approved for Treatment' },
    });

    // Financial calculations
    const activeMemberships = await this.prisma.membership.findMany({
      where: { status: 'Active', deletedAt: null },
    });
    const totalEarnings = activeMemberships.reduce(
      (sum, sub) => sum + sub.price,
      0,
    );

    return {
      totalUsers,
      totalPatients,
      totalDoctors,
      pendingDoctors,
      totalAppointments,
      completedConsultations,
      prescriptionsIssued,
      approvedTreatments,
      earnings: {
        totalCollected: totalEarnings,
        currency: 'USD',
        activeSubscribers: activeMemberships.length,
      },
    };
  }

  async getUsers(query: PaginationQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDoctors() {
    return this.prisma.doctor.findMany({
      where: { deletedAt: null },
      include: { user: true },
    });
  }

  async getPatients() {
    return this.prisma.patient.findMany({
      where: { deletedAt: null },
      include: { user: true },
    });
  }

  async getReports() {
    return this.prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        role: dto.role !== undefined ? dto.role : user.role,
        status: dto.status !== undefined ? dto.status : user.status,
      },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
