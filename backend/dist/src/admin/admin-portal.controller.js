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
exports.AdminPortalController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const update_user_dto_1 = require("./dto/update-user.dto");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const swagger_1 = require("@nestjs/swagger");
let AdminPortalController = class AdminPortalController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getDashboard() {
        const data = await this.adminService.getDashboardStats();
        return {
            message: 'Admin dashboard statistics compiled successfully',
            data,
        };
    }
    async getUsers(query) {
        const data = await this.adminService.getUsers(query);
        return {
            message: 'User account logs fetched successfully',
            data,
        };
    }
    async getDoctors() {
        const data = await this.adminService.getDoctors();
        return {
            message: 'Doctors profiles retrieved successfully',
            data,
        };
    }
    async getPatients() {
        const data = await this.adminService.getPatients();
        return {
            message: 'Patients profiles retrieved successfully',
            data,
        };
    }
    async getReports() {
        const data = await this.adminService.getReports();
        return {
            message: 'Security audit logs compiled successfully',
            data,
        };
    }
    async updateUser(id, dto) {
        const data = await this.adminService.updateUser(id, dto);
        return {
            message: 'User profile updated successfully',
            data,
        };
    }
    async removeUser(id) {
        await this.adminService.deleteUser(id);
        return {
            message: 'User account soft deleted successfully',
            data: null,
        };
    }
};
exports.AdminPortalController = AdminPortalController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Admin dashboard KPIs', description: 'Returns platform-wide metrics: total user roles, consultations, and revenue logs.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Metrics successfully aggregated.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminPortalController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'List all registered system user accounts', description: 'Supports pagination, search by phone or email, and sorting.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated user account logs returned.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], AdminPortalController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('doctors'),
    (0, swagger_1.ApiOperation)({ summary: 'List all registered clinic doctors', description: 'Returns full doctor profile details.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Doctors list fetched.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminPortalController.prototype, "getDoctors", null);
__decorate([
    (0, common_1.Get)('patients'),
    (0, swagger_1.ApiOperation)({ summary: 'List all registered patients', description: 'Returns full patient profiles.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patients list fetched.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminPortalController.prototype, "getPatients", null);
__decorate([
    (0, common_1.Get)('reports'),
    (0, swagger_1.ApiOperation)({ summary: 'Get administrative audit log report', description: 'Fetches recent security and execution log traces.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Security audit logs returned.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminPortalController.prototype, "getReports", null);
__decorate([
    (0, common_1.Put)('user/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user status or permissions role', description: 'Modifies permissions of a user profile.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User account updated.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], AdminPortalController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('user/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete user account', description: 'Disables access and marks deletedAt timestamp.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User soft-deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPortalController.prototype, "removeUser", null);
exports.AdminPortalController = AdminPortalController = __decorate([
    (0, swagger_1.ApiTags)('Admin Portal Module'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/v1/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Admin),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminPortalController);
//# sourceMappingURL=admin-portal.controller.js.map