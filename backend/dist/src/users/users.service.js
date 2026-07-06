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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOne(id) {
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
                    }
                },
                doctor: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User account not found');
        }
        return user;
    }
    async updateProfile(id, updateData) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { role: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User account not found');
        }
        if (updateData.phone !== undefined) {
            await this.prisma.user.update({
                where: { id },
                data: { phone: updateData.phone },
            });
        }
        if (user.role === 'Patient') {
            const patientData = {};
            if (updateData.firstName)
                patientData.firstName = updateData.firstName;
            if (updateData.lastName)
                patientData.lastName = updateData.lastName;
            if (updateData.dob)
                patientData.dob = new Date(updateData.dob);
            if (updateData.gender)
                patientData.gender = updateData.gender;
            if (updateData.height)
                patientData.height = parseFloat(updateData.height);
            if (updateData.weight)
                patientData.weight = parseFloat(updateData.weight);
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
                }
            });
        }
        else if (user.role === 'Doctor') {
            const doctorData = {};
            if (updateData.firstName)
                doctorData.firstName = updateData.firstName;
            if (updateData.lastName)
                doctorData.lastName = updateData.lastName;
            if (updateData.specialization)
                doctorData.specialization = updateData.specialization;
            if (updateData.experience)
                doctorData.experience = updateData.experience;
            if (updateData.profileImage)
                doctorData.profileImage = updateData.profileImage;
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
                }
            });
        }
        return this.findOne(id);
    }
    async purchaseMembership(userId, planName, price) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, patient: true },
        });
        if (!user || user.role !== 'Patient' || !user.patient) {
            throw new common_1.NotFoundException('Patient account not found');
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
            }
        });
        return this.findOne(userId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map