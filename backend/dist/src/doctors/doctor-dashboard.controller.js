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
exports.DoctorDashboardController = void 0;
const common_1 = require("@nestjs/common");
const doctors_service_1 = require("./doctors.service");
const prescriptions_service_1 = require("../prescriptions/prescriptions.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const user_decorator_1 = require("../common/decorators/user.decorator");
const create_prescription_dto_1 = require("./dto/create-prescription.dto");
const update_availability_dto_1 = require("./dto/update-availability.dto");
const swagger_1 = require("@nestjs/swagger");
let DoctorDashboardController = class DoctorDashboardController {
    doctorsService;
    prescriptionsService;
    constructor(doctorsService, prescriptionsService) {
        this.doctorsService = doctorsService;
        this.prescriptionsService = prescriptionsService;
    }
    async getDashboard(userId) {
        const data = await this.doctorsService.getDashboardData(userId);
        return {
            message: 'Doctor dashboard summary statistics compiled successfully',
            data,
        };
    }
    async getAppointments(userId) {
        const data = await this.doctorsService.getDoctorAppointments(userId);
        return {
            message: 'Doctor consultations queue retrieved successfully',
            data,
        };
    }
    async getPatients(userId) {
        const data = await this.doctorsService.getDoctorPatients(userId);
        return {
            message: 'Doctor patients list retrieved successfully',
            data,
        };
    }
    async getPatientDetails(userId, patientId) {
        const data = await this.doctorsService.getDoctorPatientDetails(userId, patientId);
        return {
            message: 'Patient records and history retrieved successfully',
            data,
        };
    }
    async createPrescription(userId, dto) {
        const doctor = await this.doctorsService.findProfileByUserId(userId);
        const followUpDate = dto.followUpDate ? new Date(dto.followUpDate) : null;
        const data = await this.prescriptionsService.create(dto.patientId, doctor.id, dto.appointmentId || null, dto.diagnosis, dto.medications, dto.instructions, followUpDate, userId);
        return {
            message: 'Prescription issued successfully',
            data,
        };
    }
    async updatePrescription(userId, id, dto) {
        const followUpDate = dto.followUpDate ? new Date(dto.followUpDate) : null;
        const data = await this.prescriptionsService.update(id, dto.diagnosis, dto.medications, dto.instructions, followUpDate, userId);
        return {
            message: 'Prescription updated successfully',
            data,
        };
    }
    async getAvailability(userId) {
        const doctor = await this.doctorsService.findProfileByUserId(userId);
        return {
            message: 'Practitioner availability status retrieved successfully',
            data: {
                availabilityStatus: doctor.availabilityStatus,
            },
        };
    }
    async updateAvailability(userId, dto) {
        const data = await this.doctorsService.updateAvailability(userId, dto.status);
        return {
            message: 'Practitioner availability status updated successfully',
            data,
        };
    }
    async updateProfile(userId, dto) {
        const data = await this.doctorsService.updateProfile(userId, dto);
        return {
            message: 'Practitioner profile updated successfully',
            data,
        };
    }
};
exports.DoctorDashboardController = DoctorDashboardController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor dashboard KPIs', description: 'Returns upcoming appointments count, pending assessments, and clinic profile status.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard metrics successfully returned.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorDashboardController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('appointments'),
    (0, swagger_1.ApiOperation)({ summary: 'List all consultations scheduled with this doctor', description: 'Returns list of appointments with linked patient name and date.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointments list fetched.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorDashboardController.prototype, "getAppointments", null);
__decorate([
    (0, common_1.Get)('patients'),
    (0, swagger_1.ApiOperation)({ summary: 'List all unique patients seen by this doctor', description: 'Returns a list of patients.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unique patients list fetched.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorDashboardController.prototype, "getPatients", null);
__decorate([
    (0, common_1.Get)('patient/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed history and prescriptions of a patient', description: 'Retrieves patient timeline specific to this doctor.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient details and history returned.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DoctorDashboardController.prototype, "getPatientDetails", null);
__decorate([
    (0, common_1.Post)('prescriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Issue a new prescription for a patient', description: 'Records diagnosis, medication instructions, and check-up follow-up.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Prescription created successfully.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_prescription_dto_1.CreatePrescriptionDto]),
    __metadata("design:returntype", Promise)
], DoctorDashboardController.prototype, "createPrescription", null);
__decorate([
    (0, common_1.Put)('prescriptions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Modify an active prescription', description: 'Updates diagnosis or dosage directions.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescription not found.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_prescription_dto_1.CreatePrescriptionDto]),
    __metadata("design:returntype", Promise)
], DoctorDashboardController.prototype, "updatePrescription", null);
__decorate([
    (0, common_1.Get)('availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current practitioner schedule status', description: 'Returns Available/Busy/OutOfOffice.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Availability status fetched.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorDashboardController.prototype, "getAvailability", null);
__decorate([
    (0, common_1.Put)('availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Update practitioner schedule status', description: 'Updates state to Available, Busy, or OutOfOffice.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Availability status updated successfully.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_availability_dto_1.UpdateAvailabilityDto]),
    __metadata("design:returntype", Promise)
], DoctorDashboardController.prototype, "updateAvailability", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update practitioner profile and fee', description: 'Updates specialization, experience, and consultation fee.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DoctorDashboardController.prototype, "updateProfile", null);
exports.DoctorDashboardController = DoctorDashboardController = __decorate([
    (0, swagger_1.ApiTags)('Doctor Dashboard Module'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/v1/doctor'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Doctor),
    __metadata("design:paramtypes", [doctors_service_1.DoctorsService,
        prescriptions_service_1.PrescriptionsService])
], DoctorDashboardController);
//# sourceMappingURL=doctor-dashboard.controller.js.map