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
exports.MembershipsController = void 0;
const common_1 = require("@nestjs/common");
const memberships_service_1 = require("./memberships.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const user_decorator_1 = require("../common/decorators/user.decorator");
const subscribe_dto_1 = require("./dto/subscribe.dto");
const swagger_1 = require("@nestjs/swagger");
let MembershipsController = class MembershipsController {
    membershipsService;
    constructor(membershipsService) {
        this.membershipsService = membershipsService;
    }
    async getPlans() {
        const data = await this.membershipsService.getPlans();
        return {
            message: 'Subscription plans fetched successfully',
            data,
        };
    }
    async subscribe(userId, dto) {
        const data = await this.membershipsService.subscribe(userId, dto);
        return {
            message: 'Subscribed to plan successfully',
            data,
        };
    }
    async getHistory(userId) {
        const data = await this.membershipsService.getHistory(userId);
        return {
            message: 'Subscription logs retrieved successfully',
            data,
        };
    }
};
exports.MembershipsController = MembershipsController;
__decorate([
    (0, common_1.Get)('plans'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve available weight management subscription plans', description: 'Lists all starter, premium, and elite monthly billing tiers.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of plans returned.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "getPlans", null);
__decorate([
    (0, common_1.Post)('subscribe'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Patient),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Subscribe to a billing plan', description: 'Locks in a plan tier for the current patient and processes checkout.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Subscription created and activated successfully.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, subscribe_dto_1.SubscribeDto]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "subscribe", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Patient),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient membership subscription history', description: 'Retrieves all past and active plans of the patient.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription logs returned.' }),
    __param(0, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "getHistory", null);
exports.MembershipsController = MembershipsController = __decorate([
    (0, swagger_1.ApiTags)('Membership Module'),
    (0, common_1.Controller)('api/v1/membership'),
    __metadata("design:paramtypes", [memberships_service_1.MembershipsService])
], MembershipsController);
//# sourceMappingURL=memberships.controller.js.map