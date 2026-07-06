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
exports.PrescriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const client_1 = require("@prisma/client");
let PrescriptionsService = class PrescriptionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.prescription.findMany({
            where: { deletedAt: null },
            include: {
                patient: true,
                doctor: true,
            },
        });
    }
    async findOne(id) {
        const prescription = await this.prisma.prescription.findFirst({
            where: { id, deletedAt: null },
            include: { patient: true, doctor: true },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription record not found');
        }
        return prescription;
    }
    async create(patientId, doctorId, appointmentId, diagnosis, medications, instructions, followUpDate, createdBy) {
        return this.prisma.prescription.create({
            data: {
                patientId,
                doctorId,
                appointmentId,
                diagnosis,
                medications,
                instructions,
                followUpDate,
                status: client_1.PrescriptionStatus.Active,
                createdBy,
            },
        });
    }
    async update(id, diagnosis, medications, instructions, followUpDate, updatedBy) {
        const prescription = await this.prisma.prescription.findFirst({
            where: { id, deletedAt: null },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription record not found');
        }
        return this.prisma.prescription.update({
            where: { id },
            data: {
                diagnosis,
                medications,
                instructions,
                followUpDate,
                updatedBy,
            },
        });
    }
    async updateStatus(id, status, updatedBy) {
        const prescription = await this.prisma.prescription.findFirst({
            where: { id, deletedAt: null },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription record not found');
        }
        return this.prisma.prescription.update({
            where: { id },
            data: { status, updatedBy },
        });
    }
    async softDelete(id, updatedBy) {
        const prescription = await this.prisma.prescription.findFirst({
            where: { id, deletedAt: null },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription record not found');
        }
        return this.prisma.prescription.update({
            where: { id },
            data: { deletedAt: new Date(), updatedBy },
        });
    }
};
exports.PrescriptionsService = PrescriptionsService;
exports.PrescriptionsService = PrescriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrescriptionsService);
//# sourceMappingURL=prescriptions.service.js.map