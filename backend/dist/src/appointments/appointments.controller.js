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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const appointments_service_1 = require("./appointments.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const user_decorator_1 = require("../common/decorators/user.decorator");
const swagger_1 = require("@nestjs/swagger");
let AppointmentsController = class AppointmentsController {
    appointmentsService;
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    async getAll(user) {
        let data;
        if (user.role === 'Admin') {
            data = await this.appointmentsService.findAll();
        }
        else if (user.role === 'Doctor') {
            data = await this.appointmentsService.findByDoctorUserId(user.sub);
        }
        else {
            data = await this.appointmentsService.findByPatientUserId(user.sub);
        }
        return {
            message: 'Appointments queue fetched successfully',
            data,
        };
    }
    async getOne(id) {
        const data = await this.appointmentsService.findOne(id);
        return {
            message: 'Appointment details retrieved successfully',
            data,
        };
    }
    async updateMeetingLink(id, meetingLink) {
        const data = await this.appointmentsService.updateMeetingLink(id, meetingLink);
        return {
            message: 'Meeting link updated successfully',
            data,
        };
    }
    async getMessages(id) {
        const data = await this.appointmentsService.getMessages(id);
        return {
            message: 'Messages retrieved successfully',
            data,
        };
    }
    async sendMessage(id, text, userId) {
        const data = await this.appointmentsService.createMessage(id, userId, text);
        return {
            message: 'Message sent successfully',
            data,
        };
    }
    async create(doctorId, appointmentDate, appointmentTime, consultationType, userId) {
        const data = await this.appointmentsService.createForUser(userId, doctorId, appointmentDate, appointmentTime, consultationType);
        return {
            message: 'Appointment booked successfully',
            data,
        };
    }
    async reschedule(id, appointmentDate, appointmentTime, userId) {
        const data = await this.appointmentsService.reschedule(id, appointmentDate, appointmentTime, userId);
        return {
            message: 'Appointment rescheduled successfully',
            data,
        };
    }
    async updateStatus(id, status, userId) {
        const data = await this.appointmentsService.updateStatus(id, status, userId);
        return {
            message: 'Appointment status updated successfully',
            data,
        };
    }
    async remove(id, userId) {
        const data = await this.appointmentsService.softDelete(id, userId);
        return {
            message: 'Appointment cancelled and soft deleted successfully',
            data,
        };
    }
    async complete(id, data, userId) {
        const result = await this.appointmentsService.completeConsultation(id, userId, data);
        return {
            message: 'Consultation completed and report submitted successfully',
            data: result,
        };
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all appointments', description: 'Returns a list of appointments in the system.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointments queue fetched successfully.' }),
    __param(0, (0, user_decorator_1.RequestUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of specific appointment', description: 'Retrieves appointment details by record ID.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment details retrieved.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Patch)(':id/meeting-link'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Doctor),
    (0, swagger_1.ApiOperation)({ summary: 'Update meeting link', description: 'Sets the meeting link for a video consultation.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('meetingLink')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "updateMeetingLink", null);
__decorate([
    (0, common_1.Get)(':id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Get messages for an appointment', description: 'Retrieves chat messages for a text consultation.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message', description: 'Sends a text message in a chat consultation.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('text')),
    __param(2, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Patient, client_1.UserRole.Admin),
    (0, swagger_1.ApiOperation)({ summary: 'Book a new consultation slot', description: 'Registers a new pending appointment slot.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Appointment booked successfully.' }),
    __param(0, (0, common_1.Body)('doctorId')),
    __param(1, (0, common_1.Body)('appointmentDate')),
    __param(2, (0, common_1.Body)('appointmentTime')),
    __param(3, (0, common_1.Body)('consultationType')),
    __param(4, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Patient, client_1.UserRole.Admin),
    (0, swagger_1.ApiOperation)({ summary: 'Reschedule an existing consultation slot', description: 'Updates date and time parameters.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment rescheduled successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found.' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['appointmentDate', 'appointmentTime'],
            properties: {
                appointmentDate: { type: 'string', example: '2026-07-20' },
                appointmentTime: { type: 'string', example: '14:30' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('appointmentDate')),
    __param(2, (0, common_1.Body)('appointmentTime')),
    __param(3, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "reschedule", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update appointment status', description: 'Sets status to Confirmed, Completed, Cancelled, etc.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment status updated successfully.' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['status'],
            properties: {
                status: { type: 'string', enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'NoShow'] },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Admin, client_1.UserRole.Patient),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel and soft-delete appointment', description: 'Marks appointment as deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment cancelled and soft deleted successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Doctor),
    (0, swagger_1.ApiOperation)({ summary: 'Submit consultation report and complete session', description: 'Restricted to assigned doctor. Creates clinical report, issues prescription, and updates status.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consultation completed successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "complete", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, swagger_1.ApiTags)('Appointments Module'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/v1/appointments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map