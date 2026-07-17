import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UserRole, DoctorStatus } from '@prisma/client';

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

    // Recent registrations
    const recentUsers = await this.prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { patient: true, doctor: true },
    });

    const recentRegistrations = recentUsers.map(u => ({
      name: u.role === 'Patient' && u.patient ? `${u.patient.firstName} ${u.patient.lastName}` : (u.role === 'Doctor' && u.doctor ? `${u.doctor.firstName} ${u.doctor.lastName}` : u.email),
      date: u.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      role: u.role,
      status: u.status,
    }));

    // Trends (6 months)
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: d.toLocaleDateString('en-US', { month: 'short' }),
        start: d,
        end: new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999),
      });
    }

    const patientGrowthTrend = await Promise.all(months.map(async m => {
      const count = await this.prisma.patient.count({
        where: { createdAt: { lte: m.end } } // cumulative
      });
      return { label: m.name, value: count };
    }));

    const monthlyRevenueTrend = await Promise.all(months.map(async m => {
      const orders = await this.prisma.order.findMany({
        where: { 
          createdAt: { gte: m.start, lte: m.end },
          status: 'Paid'
        }
      });
      const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      const memberships = await this.prisma.membership.findMany({
         where: {
            createdAt: { gte: m.start, lte: m.end },
            status: 'Active'
         }
      });
      const membershipRevenue = memberships.reduce((sum, mem) => sum + mem.price, 0);

      return { label: m.name, value: revenue + membershipRevenue };
    }));

    return {
      totalUsers,
      totalPatients,
      totalDoctors,
      pendingDoctors,
      totalAppointments,
      completedConsultations,
      prescriptionsIssued,
      approvedTreatments,
      patientGrowthTrend,
      monthlyRevenueTrend,
      recentRegistrations,
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
      include: { user: true, memberships: { orderBy: { createdAt: 'desc' } } },
    });
  }

  async getMembershipsStats() {
    const allMemberships = await this.prisma.membership.findMany({
      where: { deletedAt: null },
      include: {
        patient: {
          include: { user: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const activeMemberships = allMemberships.filter(m => m.status === 'Active');
    
    // Detailed list for the table
    const membershipsList = allMemberships.map(m => ({
      id: m.id,
      patientName: `${m.patient.firstName} ${m.patient.lastName}`,
      planName: m.planName,
      price: `₹${m.price.toLocaleString()}`,
      startDate: m.startDate.toISOString(),
      expiryDate: m.expiryDate.toISOString(),
      status: m.status,
    }));

    return {
      memberships: membershipsList,
      totalActive: activeMemberships.length,
      averageMonthlyPayout: activeMemberships.length > 0 ? `₹${Math.round(activeMemberships.reduce((sum, mem) => sum + mem.price, 0) / activeMemberships.length).toLocaleString()}` : '₹0',
    };
  }

  async getReports() {
    return this.prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPayments() {
    const orders = await this.prisma.order.findMany({
      where: { deletedAt: null },
      include: {
        patient: {
          include: { user: true }
        }
      }
    });

    const memberships = await this.prisma.membership.findMany({
      where: { deletedAt: null },
      include: {
        patient: {
          include: { user: true }
        }
      }
    });

    const transactions: any[] = [];

    orders.forEach(order => {
      transactions.push({
        id: order.id,
        patient: `${order.patient.firstName} ${order.patient.lastName}`,
        amount: `₹${order.totalAmount.toLocaleString()}`,
        method: order.paymentMethod || 'Credit Card',
        status: order.status === 'Paid' || order.status === 'Completed' || order.status === 'Success' ? 'Success' : (order.status === 'Pending' ? 'Failed' : 'Failed'),
        date: order.createdAt,
      });
    });

    memberships.forEach(membership => {
      transactions.push({
        id: membership.id,
        patient: `${membership.patient.firstName} ${membership.patient.lastName}`,
        amount: `₹${membership.price.toLocaleString()}`,
        method: 'Razorpay', // Assuming Razorpay for memberships
        status: membership.status === 'Active' || membership.status === 'Expired' ? 'Success' : 'Failed',
        date: membership.createdAt,
      });
    });

    transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

    return transactions.map(tx => ({
      ...tx,
      date: tx.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }));
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

  async createDoctor(dto: CreateDoctorDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create User and Doctor in a transaction
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: dto.email,
          role: UserRole.Doctor,
          isVerified: true, // Since Admin is creating it
        }
      });

      const doctor = await prisma.doctor.create({
        data: {
          userId: user.id,
          firstName: dto.firstName,
          lastName: dto.lastName,
          specialization: dto.specialization,
          experience: dto.experience,
          qualification: dto.qualification,
          licenseNumber: dto.licenseNumber,
          hospital: dto.hospital,
          bio: dto.bio,
          bankName: dto.bankName,
          accountNumber: dto.accountNumber,
          ifscCode: dto.ifscCode,
          consultationFee: dto.consultationFee,
          status: 'Verified',
        }
      });

      return { user, doctor };
    });
  }
}
