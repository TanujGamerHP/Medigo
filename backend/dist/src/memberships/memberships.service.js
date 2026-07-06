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
exports.MembershipsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const client_1 = require("@prisma/client");
let MembershipsService = class MembershipsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPlans() {
        return [
            {
                name: 'Starter',
                price: 149.0,
                billing: 'monthly',
                description: 'Basic access to medical team and GLP-1 intake prescriptions.',
            },
            {
                name: 'Premium',
                price: 299.0,
                billing: 'monthly',
                description: 'Standard access including live AI coaching and monthly check-ins.',
            },
            {
                name: 'Elite',
                price: 499.0,
                billing: 'monthly',
                description: 'All-inclusive medical consultations, prioritised clinical response times.',
            },
        ];
    }
    async subscribe(userId, dto) {
        const patient = await this.prisma.patient.findUnique({
            where: { userId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient profile not found.');
        }
        const startDate = new Date();
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        return this.prisma.membership.create({
            data: {
                patientId: patient.id,
                planName: dto.planName,
                price: dto.price,
                startDate,
                expiryDate,
                status: client_1.MembershipStatus.Active,
                createdBy: userId,
            },
        });
    }
    async getHistory(userId) {
        const patient = await this.prisma.patient.findUnique({
            where: { userId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient profile not found.');
        }
        return this.prisma.membership.findMany({
            where: { patientId: patient.id, deletedAt: null },
            orderBy: { startDate: 'desc' },
        });
    }
};
exports.MembershipsService = MembershipsService;
exports.MembershipsService = MembershipsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MembershipsService);
//# sourceMappingURL=memberships.service.js.map