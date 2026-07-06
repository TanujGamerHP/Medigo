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
exports.AssessmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let AssessmentsService = class AssessmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async startSession(userId) {
        const patient = await this.prisma.patient.findUnique({
            where: { userId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient profile not found. Complete profile intake first.');
        }
        return {
            sessionId: `sess-${Math.random().toString(36).substring(2, 9)}`,
            status: 'Ready',
            message: 'Assessment session initiated successfully',
        };
    }
    async submitAssessment(userId, dto) {
        const patient = await this.prisma.patient.findUnique({
            where: { userId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient profile not found. Complete profile intake first.');
        }
        const bmi = parseFloat((dto.weight / (dto.height * dto.height)).toFixed(2));
        let result = 'Normal Weight';
        let recommendation = 'Maintain a balanced diet and regular physical activity.';
        if (bmi >= 30) {
            result = 'Obese';
            recommendation = 'Recommended for Wegovy / Mounjaro medical weight management programs.';
        }
        else if (bmi >= 25) {
            result = 'Overweight';
            recommendation = 'Recommended for Semaglutide (Ozempic) weight loss programs.';
        }
        else if (bmi < 18.5) {
            result = 'Underweight';
            recommendation = 'Recommended for personalized nutritional therapy.';
        }
        const assessment = await this.prisma.assessment.create({
            data: {
                patientId: patient.id,
                assessmentScore: Math.round(bmi),
                bmi,
                result,
                recommendation,
                createdBy: userId,
            },
        });
        await this.prisma.patient.update({
            where: { id: patient.id },
            data: {
                weight: dto.weight,
                height: dto.height * 100,
            },
        });
        const matchedDoctors = await this.prisma.doctor.findMany({
            take: 2,
            where: { deletedAt: null, availabilityStatus: 'Available', status: 'Verified' },
        });
        return {
            assessmentId: assessment.id,
            bmi,
            result,
            recommendation,
            submittedAt: assessment.submittedAt,
            matchedDoctors: matchedDoctors.map(doc => ({
                id: doc.id,
                name: `Dr. ${doc.firstName} ${doc.lastName}`,
                specialization: doc.specialization,
                consultationFee: doc.consultationFee,
            })),
        };
    }
    async getHistory(userId) {
        const patient = await this.prisma.patient.findUnique({
            where: { userId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient profile not found.');
        }
        return this.prisma.assessment.findMany({
            where: { patientId: patient.id, deletedAt: null },
            orderBy: { submittedAt: 'desc' },
        });
    }
    async getOne(id, userId) {
        const patient = await this.prisma.patient.findUnique({
            where: { userId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient profile not found.');
        }
        const assessment = await this.prisma.assessment.findFirst({
            where: { id, patientId: patient.id, deletedAt: null },
        });
        if (!assessment) {
            throw new common_1.NotFoundException('Assessment record not found.');
        }
        return assessment;
    }
};
exports.AssessmentsService = AssessmentsService;
exports.AssessmentsService = AssessmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssessmentsService);
//# sourceMappingURL=assessments.service.js.map