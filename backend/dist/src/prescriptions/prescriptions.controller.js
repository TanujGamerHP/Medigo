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
exports.PrescriptionsController = void 0;
const common_1 = require("@nestjs/common");
const prescriptions_service_1 = require("./prescriptions.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const user_decorator_1 = require("../common/decorators/user.decorator");
let PrescriptionsController = class PrescriptionsController {
    prescriptionsService;
    constructor(prescriptionsService) {
        this.prescriptionsService = prescriptionsService;
    }
    async getAll() {
        const data = await this.prescriptionsService.findAll();
        return {
            message: 'Prescriptions logs fetched successfully',
            data,
        };
    }
    async create(patientId, doctorId, appointmentId, diagnosis, medications, instructions, followUpDateStr, userId) {
        const followUpDate = followUpDateStr ? new Date(followUpDateStr) : null;
        const data = await this.prescriptionsService.create(patientId, doctorId, appointmentId, diagnosis, medications, instructions, followUpDate, userId);
        return {
            message: 'Prescription issued successfully',
            data,
        };
    }
    async updateStatus(id, status, userId) {
        const data = await this.prescriptionsService.updateStatus(id, status, userId);
        return {
            message: 'Prescription status updated successfully',
            data,
        };
    }
    async remove(id, userId) {
        const data = await this.prescriptionsService.softDelete(id, userId);
        return {
            message: 'Prescription record soft deleted successfully',
            data,
        };
    }
};
exports.PrescriptionsController = PrescriptionsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Doctor, client_1.UserRole.Admin),
    __param(0, (0, common_1.Body)('patientId')),
    __param(1, (0, common_1.Body)('doctorId')),
    __param(2, (0, common_1.Body)('appointmentId')),
    __param(3, (0, common_1.Body)('diagnosis')),
    __param(4, (0, common_1.Body)('medications')),
    __param(5, (0, common_1.Body)('instructions')),
    __param(6, (0, common_1.Body)('followUpDate')),
    __param(7, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, String, String, String, Object, String]),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Doctor, client_1.UserRole.Admin, client_1.UserRole.Pharmacy),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Doctor, client_1.UserRole.Admin),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "remove", null);
exports.PrescriptionsController = PrescriptionsController = __decorate([
    (0, common_1.Controller)('api/v1/prescriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [prescriptions_service_1.PrescriptionsService])
], PrescriptionsController);
//# sourceMappingURL=prescriptions.controller.js.map