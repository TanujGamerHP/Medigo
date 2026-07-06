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
exports.DoctorsController = void 0;
const common_1 = require("@nestjs/common");
const doctors_service_1 = require("./doctors.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let DoctorsController = class DoctorsController {
    doctorsService;
    constructor(doctorsService) {
        this.doctorsService = doctorsService;
    }
    async getAvailability() {
        const data = await this.doctorsService.getAvailability();
        return {
            message: 'Doctors availability schedules retrieved successfully',
            data,
        };
    }
    async getAll() {
        const data = await this.doctorsService.findAll();
        return {
            message: 'Doctors list fetched successfully',
            data,
        };
    }
    async getOne(id) {
        const data = await this.doctorsService.findOne(id);
        return {
            message: 'Doctor details fetched successfully',
            data,
        };
    }
    async updateStatus(id, status) {
        const data = await this.doctorsService.updateStatus(id, status);
        return {
            message: 'Doctor verification status updated successfully',
            data,
        };
    }
};
exports.DoctorsController = DoctorsController;
__decorate([
    (0, common_1.Get)('availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor clinical availability hours', description: 'Lists working days, timeslots, and general status of all practitioners.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Availability logs fetched.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getAvailability", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all registered doctors', description: 'Returns a list of doctors and specialties.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Doctors list fetched.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of specific doctor profile', description: 'Retrieves info by doctor record ID.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Doctor profile returned.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Doctor profile not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update doctor credential status (Admin only)', description: 'Locks, verifies, or suspends doctor profile.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Doctor status updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "updateStatus", null);
exports.DoctorsController = DoctorsController = __decorate([
    (0, swagger_1.ApiTags)('Doctors Listing Module'),
    (0, common_1.Controller)('api/v1/doctors'),
    __metadata("design:paramtypes", [doctors_service_1.DoctorsService])
], DoctorsController);
//# sourceMappingURL=doctors.controller.js.map