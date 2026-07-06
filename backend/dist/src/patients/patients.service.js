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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let PatientsService = class PatientsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.patient.findMany({
            where: { deletedAt: null },
            include: {
                appointments: true,
                memberships: true,
                prescriptions: true,
            },
        });
    }
    async findOne(id) {
        const patient = await this.prisma.patient.findFirst({
            where: { id, deletedAt: null },
            include: {
                appointments: true,
                memberships: true,
                prescriptions: true,
            },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient record not found');
        }
        return patient;
    }
    async updateStatus(id, status) {
        const patient = await this.prisma.patient.findFirst({
            where: { id, deletedAt: null },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient record not found');
        }
        return this.prisma.patient.update({
            where: { id },
            data: { status },
        });
    }
    async findProfileByUserId(userId) {
        const patient = await this.prisma.patient.findUnique({
            where: { userId },
            include: { user: true },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        return patient;
    }
    async updateProfileByUserId(userId, dto) {
        const patient = await this.prisma.patient.findUnique({
            where: { userId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        const dob = dto.dob ? new Date(dto.dob) : undefined;
        return this.prisma.patient.update({
            where: { userId },
            data: {
                firstName: dto.firstName !== undefined ? dto.firstName : patient.firstName,
                lastName: dto.lastName !== undefined ? dto.lastName : patient.lastName,
                dob: dob !== undefined ? dob : patient.dob,
                gender: dto.gender !== undefined ? dto.gender : patient.gender,
                height: dto.height !== undefined ? dto.height : patient.height,
                weight: dto.weight !== undefined ? dto.weight : patient.weight,
                bloodGroup: dto.bloodGroup !== undefined ? dto.bloodGroup : patient.bloodGroup,
                emergencyContact: dto.emergencyContact !== undefined ? dto.emergencyContact : patient.emergencyContact,
                profileImage: dto.profileImage !== undefined ? dto.profileImage : patient.profileImage,
            },
        });
    }
    async getDashboardData(userId) {
        const patient = await this.findProfileByUserId(userId);
        const nextAppointment = await this.prisma.appointment.findFirst({
            where: {
                patientId: patient.id,
                status: 'Confirmed',
                deletedAt: null,
            },
            orderBy: { appointmentDate: 'asc' },
            include: { doctor: true },
        });
        const activePrescriptions = await this.prisma.prescription.findMany({
            where: {
                patientId: patient.id,
                status: 'Active',
                deletedAt: null,
            },
            include: { doctor: true },
        });
        const activeMembership = await this.prisma.membership.findFirst({
            where: {
                patientId: patient.id,
                status: 'Active',
                deletedAt: null,
            },
            orderBy: { startDate: 'desc' },
        });
        const bmi = patient.weight && patient.height
            ? parseFloat((patient.weight / (patient.height * patient.height)).toFixed(2))
            : null;
        return {
            profile: {
                firstName: patient.firstName,
                lastName: patient.lastName,
                bmi,
                status: patient.status,
            },
            nextAppointment: nextAppointment ? {
                id: nextAppointment.id,
                doctor: `Dr. ${nextAppointment.doctor.firstName} ${nextAppointment.doctor.lastName}`,
                date: nextAppointment.appointmentDate,
                time: nextAppointment.appointmentTime,
                type: nextAppointment.consultationType,
            } : null,
            activePrescriptions: activePrescriptions.map(pres => ({
                id: pres.id,
                doctor: `Dr. ${pres.doctor.firstName} ${pres.doctor.lastName}`,
                medications: pres.medications,
                instructions: pres.instructions,
            })),
            activeMembership: activeMembership ? {
                planName: activeMembership.planName,
                expiryDate: activeMembership.expiryDate,
            } : null,
        };
    }
    async getPatientAppointments(userId) {
        const patient = await this.findProfileByUserId(userId);
        return this.prisma.appointment.findMany({
            where: { patientId: patient.id, deletedAt: null },
            include: { doctor: true },
            orderBy: { appointmentDate: 'desc' },
        });
    }
    async getPatientPrescriptions(userId) {
        const patient = await this.findProfileByUserId(userId);
        return this.prisma.prescription.findMany({
            where: { patientId: patient.id, deletedAt: null },
            include: { doctor: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getPatientMembership(userId) {
        const patient = await this.findProfileByUserId(userId);
        return this.prisma.membership.findMany({
            where: { patientId: patient.id, deletedAt: null },
            orderBy: { startDate: 'desc' },
        });
    }
    async getPatientNotifications(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PatientsService);
//# sourceMappingURL=patients.service.js.map