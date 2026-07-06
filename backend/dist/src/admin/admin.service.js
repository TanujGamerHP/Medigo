"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const totalUsers = await this.prisma.user.count({ where: { deletedAt: null } });
        const totalPatients = await this.prisma.patient.count({ where: { deletedAt: null } });
        const totalDoctors = await this.prisma.doctor.count({ where: { status: 'Verified', deletedAt: null } });
        const pendingDoctors = await this.prisma.doctor.count({ where: { status: 'PendingCredentials', deletedAt: null } });
        const totalAppointments = await this.prisma.appointment.count({ where: { deletedAt: null } });
        const completedConsultations = await this.prisma.appointment.count({
            where: { status: 'Completed', deletedAt: null },
        });
        const prescriptionsIssued = await this.prisma.prescription.count({
            where: { deletedAt: null },
        });
        const approvedTreatments = await this.prisma.consultation.count({
            where: { treatmentRecommendation: 'Approved for Treatment' },
        });
        const activeMemberships = await this.prisma.membership.findMany({
            where: { status: 'Active', deletedAt: null },
        });
        const totalEarnings = activeMemberships.reduce((sum, sub) => sum + sub.price, 0);
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
    async getUsers(query) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
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
    async updateUser(id, dto) {
        const user = await this.prisma.user.findFirst({
            where: { id, deletedAt: null },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.prisma.user.update({
            where: { id },
            data: {
                role: dto.role !== undefined ? dto.role : user.role,
                status: dto.status !== undefined ? dto.status : user.status,
            },
        });
    }
    async deleteUser(id) {
        const user = await this.prisma.user.findFirst({
            where: { id, deletedAt: null },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map