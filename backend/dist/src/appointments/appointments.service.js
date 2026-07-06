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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const client_1 = require("@prisma/client");
const realtime_service_1 = require("../realtime/realtime.service");
let AppointmentsService = class AppointmentsService {
    prisma;
    realtimeService;
    constructor(prisma, realtimeService) {
        this.prisma = prisma;
        this.realtimeService = realtimeService;
    }
    async findAll() {
        return this.prisma.appointment.findMany({
            where: { deletedAt: null },
            include: {
                patient: true,
                doctor: true,
            },
        });
    }
    async findByPatientUserId(userId) {
        return this.prisma.appointment.findMany({
            where: {
                deletedAt: null,
                patient: { userId }
            },
            include: {
                patient: true,
                doctor: true,
            },
            orderBy: { appointmentDate: 'asc' }
        });
    }
    async findByDoctorUserId(userId) {
        return this.prisma.appointment.findMany({
            where: {
                deletedAt: null,
                doctor: { userId }
            },
            include: {
                patient: true,
                doctor: true,
            },
            orderBy: { appointmentDate: 'asc' }
        });
    }
    async findOne(id) {
        const appointment = await this.prisma.appointment.findFirst({
            where: { id, deletedAt: null },
            include: {
                patient: true,
                doctor: true,
                prescription: true,
                consultation: true,
            },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment record not found');
        }
        return appointment;
    }
    async createForUser(userId, doctorId, appointmentDate, appointmentTime, consultationType) {
        const patient = await this.prisma.patient.findUnique({
            where: { userId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient profile not found. Please complete registration.');
        }
        const doctor = await this.prisma.doctor.findUnique({
            where: { id: doctorId }
        });
        const appointment = await this.prisma.appointment.create({
            data: {
                patientId: patient.id,
                doctorId,
                appointmentDate,
                appointmentTime,
                consultationType,
                status: client_1.AppointmentStatus.Pending,
                createdBy: userId,
            },
        });
        if (doctor && doctor.userId) {
            await this.prisma.notification.create({
                data: {
                    userId: doctor.userId,
                    title: "New Appointment Booked",
                    message: `Patient ${patient.firstName} ${patient.lastName} has booked a ${consultationType} consultation on ${appointmentDate} at ${appointmentTime}.`,
                    type: "appointment"
                }
            });
        }
        return appointment;
    }
    async create(patientId, doctorId, appointmentDate, appointmentTime, consultationType, createdBy) {
        return this.prisma.appointment.create({
            data: {
                patientId,
                doctorId,
                appointmentDate,
                appointmentTime,
                consultationType,
                status: client_1.AppointmentStatus.Pending,
                createdBy,
            },
        });
    }
    async reschedule(id, appointmentDate, appointmentTime, updatedBy) {
        const appointment = await this.findOne(id);
        return this.prisma.appointment.update({
            where: { id },
            data: {
                appointmentDate,
                appointmentTime,
                updatedBy,
            },
        });
    }
    async updateMeetingLink(id, meetingLink) {
        return this.prisma.appointment.update({
            where: { id },
            data: { meetingLink },
        });
    }
    async getMessages(appointmentId) {
        return this.prisma.message.findMany({
            where: { appointmentId },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: {
                    select: { id: true, role: true }
                }
            }
        });
    }
    async createMessage(appointmentId, senderId, text) {
        return this.prisma.message.create({
            data: {
                appointmentId,
                senderId,
                text
            },
            include: {
                sender: {
                    select: { id: true, role: true }
                }
            }
        });
    }
    async updateStatus(id, status, updatedBy) {
        const appointment = await this.prisma.appointment.findFirst({
            where: { id, deletedAt: null },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment record not found');
        }
        return this.prisma.appointment.update({
            where: { id },
            data: { status, updatedBy },
        });
    }
    async softDelete(id, updatedBy) {
        const appointment = await this.prisma.appointment.findFirst({
            where: { id, deletedAt: null },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment record not found');
        }
        return this.prisma.appointment.update({
            where: { id },
            data: { deletedAt: new Date(), updatedBy },
        });
    }
    async completeConsultation(id, doctorUserId, data) {
        const { chiefComplaint, diagnosis, clinicalFindings, treatmentRecommendation, medications, instructions, lifestyleAdvice, dietRecommendation, exerciseRecommendation, followUpDate, additionalNotes, } = data;
        if (!chiefComplaint || !diagnosis || !clinicalFindings || !treatmentRecommendation) {
            throw new common_1.BadRequestException('Required fields missing: chiefComplaint, diagnosis, clinicalFindings, treatmentRecommendation');
        }
        const validRecommendations = ['Approved for Treatment', 'Requires Further Evaluation', 'Treatment Rejected'];
        if (!validRecommendations.includes(treatmentRecommendation)) {
            throw new common_1.BadRequestException(`Invalid treatmentRecommendation. Must be one of: ${validRecommendations.join(', ')}`);
        }
        return this.prisma.$transaction(async (tx) => {
            const appointment = await tx.appointment.findFirst({
                where: { id, deletedAt: null },
                include: {
                    patient: { include: { user: true } },
                    doctor: { include: { user: true } },
                },
            });
            if (!appointment) {
                throw new common_1.NotFoundException('Appointment record not found');
            }
            if (appointment.status === client_1.AppointmentStatus.Completed) {
                throw new common_1.BadRequestException('Consultation is already completed');
            }
            if (appointment.doctor.userId !== doctorUserId) {
                throw new common_1.BadRequestException('Only the assigned doctor can complete this consultation');
            }
            const existingConsultation = await tx.consultation.findUnique({
                where: { appointmentId: id },
            });
            if (existingConsultation) {
                throw new common_1.BadRequestException('Consultation report already submitted');
            }
            const consultation = await tx.consultation.create({
                data: {
                    appointmentId: id,
                    patientId: appointment.patientId,
                    doctorId: appointment.doctorId,
                    chiefComplaint,
                    diagnosis,
                    clinicalFindings,
                    treatmentRecommendation,
                    lifestyleAdvice,
                    dietRecommendation,
                    exerciseRecommendation,
                    followUpDate: followUpDate ? new Date(followUpDate) : null,
                    additionalNotes,
                },
            });
            const prescription = await tx.prescription.create({
                data: {
                    appointmentId: id,
                    patientId: appointment.patientId,
                    doctorId: appointment.doctorId,
                    diagnosis,
                    medications: medications || '',
                    instructions: instructions || '',
                    followUpDate: followUpDate ? new Date(followUpDate) : null,
                    status: client_1.PrescriptionStatus.Active,
                    createdBy: doctorUserId,
                },
            });
            const updatedAppointment = await tx.appointment.update({
                where: { id },
                data: {
                    status: client_1.AppointmentStatus.Completed,
                    updatedBy: doctorUserId,
                },
            });
            const userNotifications = [];
            userNotifications.push(tx.notification.create({
                data: {
                    userId: appointment.patient.userId,
                    title: 'Consultation Completed',
                    message: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} has completed your consultation and submitted the clinical report.`,
                    type: 'consultation',
                },
            }), tx.notification.create({
                data: {
                    userId: appointment.patient.userId,
                    title: 'Prescription Issued',
                    message: `A new prescription has been generated for you by Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}.`,
                    type: 'prescription',
                },
            }));
            if (treatmentRecommendation === 'Approved for Treatment') {
                userNotifications.push(tx.notification.create({
                    data: {
                        userId: appointment.patient.userId,
                        title: 'Treatment Approved',
                        message: 'Congratulations! Your clinical treatment plan has been approved. You are now eligible to buy prescribed medications.',
                        type: 'treatment',
                    },
                }), tx.notification.create({
                    data: {
                        userId: appointment.patient.userId,
                        title: 'Medicines Available',
                        message: 'Your prescribed medicines are available in your queue for checkout.',
                        type: 'order_status',
                    },
                }));
            }
            userNotifications.push(tx.notification.create({
                data: {
                    userId: doctorUserId,
                    title: 'Consultation Completed Successfully',
                    message: `You have successfully completed the consultation and clinical report for patient ${appointment.patient.firstName} ${appointment.patient.lastName}.`,
                    type: 'consultation',
                },
            }));
            const admins = await tx.user.findMany({
                where: { role: 'Admin', deletedAt: null },
            });
            for (const admin of admins) {
                userNotifications.push(tx.notification.create({
                    data: {
                        userId: admin.id,
                        title: 'Consultation Completed Platform-Wide',
                        message: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} completed consultation for patient ${appointment.patient.firstName} ${appointment.patient.lastName}.`,
                        type: 'admin_alert',
                    },
                }));
            }
            await Promise.all(userNotifications);
            await tx.auditLog.create({
                data: {
                    userId: doctorUserId,
                    action: 'CONSULTATION_COMPLETED',
                    details: `Appointment ID: ${id}, Doctor ID: ${appointment.doctorId}, Patient ID: ${appointment.patientId}, Recommendation: ${treatmentRecommendation}`,
                },
            });
            setTimeout(() => {
                this.realtimeService.emit('consultation.completed', { appointmentId: id, patientId: appointment.patientId, doctorId: appointment.doctorId });
                this.realtimeService.emit('prescription.generated', { prescriptionId: prescription.id, patientId: appointment.patientId });
                if (treatmentRecommendation === 'Approved for Treatment') {
                    this.realtimeService.emit('treatment.approved', { patientId: appointment.patientId });
                    this.realtimeService.emit('medicine.eligible', { patientId: appointment.patientId });
                }
                this.realtimeService.emit('patient.updated', { targetUserId: appointment.patient.userId, patientId: appointment.patientId });
                this.realtimeService.emit('doctor.updated', { targetUserId: appointment.doctor.userId, doctorId: appointment.doctorId });
                this.realtimeService.emit('admin.updated', { role: 'Admin' });
            }, 50);
            return {
                appointment: updatedAppointment,
                consultation,
                prescription,
            };
        });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        realtime_service_1.RealtimeService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map