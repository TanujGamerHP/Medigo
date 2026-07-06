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
exports.DoctorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let DoctorsService = class DoctorsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.doctor.findMany({
            where: { deletedAt: null },
            include: { user: true },
        });
    }
    async findOne(id) {
        const doctor = await this.prisma.doctor.findFirst({
            where: { id, deletedAt: null },
            include: { user: true },
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor record not found');
        }
        return doctor;
    }
    async updateStatus(id, status) {
        const doctor = await this.prisma.doctor.findFirst({
            where: { id, deletedAt: null },
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor record not found');
        }
        return this.prisma.doctor.update({
            where: { id },
            data: { status },
        });
    }
    async getAvailability() {
        const doctors = await this.findAll();
        return doctors.map(doc => ({
            doctorId: doc.id,
            name: `Dr. ${doc.firstName} ${doc.lastName}`,
            specialization: doc.specialization,
            availabilityStatus: doc.availabilityStatus,
            weeklyHours: [
                { day: 'Monday', slots: ['09:00 - 12:00', '14:00 - 17:00'] },
                { day: 'Wednesday', slots: ['10:00 - 13:00', '15:00 - 18:00'] },
                { day: 'Friday', slots: ['09:00 - 12:00', '13:00 - 16:00'] },
            ],
        }));
    }
    async findProfileByUserId(userId) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId },
            include: { user: true },
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        return doctor;
    }
    async getDashboardData(userId) {
        const doctor = await this.findProfileByUserId(userId);
        const appointmentsCount = await this.prisma.appointment.count({
            where: { doctorId: doctor.id, deletedAt: null },
        });
        const pendingAppointments = await this.prisma.appointment.count({
            where: { doctorId: doctor.id, status: 'Pending', deletedAt: null },
        });
        const upcoming = await this.prisma.appointment.findMany({
            where: { doctorId: doctor.id, deletedAt: null },
            take: 5,
            orderBy: { appointmentDate: 'asc' },
            include: { patient: true },
        });
        return {
            profile: {
                name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
                specialization: doctor.specialization,
                availabilityStatus: doctor.availabilityStatus,
                status: doctor.status,
            },
            metrics: {
                totalAppointments: appointmentsCount,
                pendingApprovals: pendingAppointments,
                allTimeRevenue: appointmentsCount * (doctor.consultationFee || 0),
                monthlyRevenue: appointmentsCount * (doctor.consultationFee || 0),
            },
            upcomingConsultations: upcoming.map(app => ({
                id: app.id,
                patientName: `${app.patient.firstName} ${app.patient.lastName}`,
                date: app.appointmentDate,
                time: app.appointmentTime,
                status: app.status,
            })),
        };
    }
    async getDoctorAppointments(userId) {
        const doctor = await this.findProfileByUserId(userId);
        return this.prisma.appointment.findMany({
            where: { doctorId: doctor.id, deletedAt: null },
            include: { patient: true },
            orderBy: { appointmentDate: 'desc' },
        });
    }
    async getDoctorPatients(userId) {
        const doctor = await this.findProfileByUserId(userId);
        const appointments = await this.prisma.appointment.findMany({
            where: { doctorId: doctor.id, deletedAt: null },
            select: { patientId: true },
        });
        const patientIds = Array.from(new Set(appointments.map(a => a.patientId)));
        return this.prisma.patient.findMany({
            where: {
                id: { in: patientIds },
                deletedAt: null,
            },
        });
    }
    async getDoctorPatientDetails(userId, patientId) {
        const doctor = await this.findProfileByUserId(userId);
        const patient = await this.prisma.patient.findFirst({
            where: { id: patientId, deletedAt: null },
            include: {
                appointments: {
                    where: { deletedAt: null },
                    include: {
                        consultation: true,
                        prescription: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
                prescriptions: {
                    where: { deletedAt: null },
                    orderBy: { createdAt: 'desc' },
                },
                assessments: {
                    where: { deletedAt: null },
                    orderBy: { submittedAt: 'desc' },
                },
            },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient record not found');
        }
        return patient;
    }
    async updateAvailability(userId, availabilityStatus) {
        const doctor = await this.findProfileByUserId(userId);
        return this.prisma.doctor.update({
            where: { id: doctor.id },
            data: { availabilityStatus },
        });
    }
    async updateProfile(userId, data) {
        const doctor = await this.findProfileByUserId(userId);
        return this.prisma.doctor.update({
            where: { id: doctor.id },
            data: {
                specialization: data.specialization,
                qualification: data.qualification,
                experience: data.experience,
                consultationFee: data.consultationFee ? parseFloat(data.consultationFee) : undefined,
            },
        });
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DoctorsService);
//# sourceMappingURL=doctors.service.js.map