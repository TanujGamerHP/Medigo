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
exports.PatientPortalController = void 0;
const common_1 = require("@nestjs/common");
const patients_service_1 = require("./patients.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const user_decorator_1 = require("../common/decorators/user.decorator");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const swagger_1 = require("@nestjs/swagger");
let PatientPortalController = class PatientPortalController {
    patientsService;
    constructor(patientsService) {
        this.patientsService = patientsService;
    }
    async getProfile(userId) {
        const data = await this.patientsService.findProfileByUserId(userId);
        return {
            message: 'Patient profile retrieved successfully',
            data,
        };
    }
    async updateProfile(userId, dto) {
        const data = await this.patientsService.updateProfileByUserId(userId, dto);
        return {
            message: 'Patient profile updated successfully',
            data,
        };
    }
    async getDashboard(userId) {
        const data = await this.patientsService.getDashboardData(userId);
        return {
            message: 'Patient dashboard summary statistics compiled successfully',
            data,
        };
    }
    async getAppointments(userId) {
        const data = await this.patientsService.getPatientAppointments(userId);
        return {
            message: 'Patient consultations queue retrieved successfully',
            data,
        };
    }
    async getPrescriptions(userId) {
        const data = await this.patientsService.getPatientPrescriptions(userId);
        return {
            message: 'Patient prescriptions list retrieved successfully',
            data,
        };
    }
    async getMembership(userId) {
        const data = await this.patientsService.getPatientMembership(userId);
        return {
            message: 'Patient membership status retrieved successfully',
            data,
        };
    }
    async getNotifications(userId) {
        const data = await this.patientsService.getPatientNotifications(userId);
        return {
            message: 'Patient alerts list retrieved successfully',
            data,
        };
    }
};
exports.PatientPortalController = PatientPortalController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get logged-in patient profile', description: 'Returns the personal and clinical profile details of the patient.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile retrieved successfully.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update patient profile info', description: 'Accepts customizable parameters like height, weight, and emergency details.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient dashboard summary KPIs', description: 'Fetches active prescriptions, upcoming appointments, BMI tracker, and status.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KPI dataset returned.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('appointments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all patient consultations', description: 'Lists past and upcoming appointments of the user.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointments list fetched.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getAppointments", null);
__decorate([
    (0, common_1.Get)('prescriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient prescriptions logs', description: 'Lists all issued, active, or refilled medication prescriptions.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescriptions logs fetched.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getPrescriptions", null);
__decorate([
    (0, common_1.Get)('membership'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient active membership tier details', description: 'Returns active plan history.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership info retrieved.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getMembership", null);
__decorate([
    (0, common_1.Get)('notifications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient account notifications', description: 'Lists all email or in-app alerts dispatched.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert logs compiled.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientPortalController.prototype, "getNotifications", null);
exports.PatientPortalController = PatientPortalController = __decorate([
    (0, swagger_1.ApiTags)('Patient Portal Module'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/v1/patient'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Patient),
    __metadata("design:paramtypes", [patients_service_1.PatientsService])
], PatientPortalController);
//# sourceMappingURL=patient-portal.controller.js.map