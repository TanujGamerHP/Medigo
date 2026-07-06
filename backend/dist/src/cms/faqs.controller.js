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
exports.FaqsController = void 0;
const common_1 = require("@nestjs/common");
const cms_service_1 = require("./cms.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const user_decorator_1 = require("../common/decorators/user.decorator");
const create_faq_dto_1 = require("./dto/create-faq.dto");
const swagger_1 = require("@nestjs/swagger");
let FaqsController = class FaqsController {
    cmsService;
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    async getAll() {
        const data = await this.cmsService.findAllFaqs();
        return {
            message: 'FAQs fetched successfully',
            data,
        };
    }
    async create(dto, userId) {
        const data = await this.cmsService.createFaq(dto.question, dto.answer, dto.category, userId);
        return {
            message: 'FAQ created successfully',
            data,
        };
    }
    async remove(id, userId) {
        await this.cmsService.softDeleteFaq(id, userId);
        return {
            message: 'FAQ soft deleted successfully',
            data: null,
        };
    }
};
exports.FaqsController = FaqsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all general and medication FAQs', description: 'Lists all available collapsible questions and answers.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FAQs list fetched.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FaqsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new FAQ record (Admin only)', description: 'Saves collapsible item details.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'FAQ created successfully.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_faq_dto_1.CreateFaqDto, String]),
    __metadata("design:returntype", Promise)
], FaqsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete FAQ record (Admin only)', description: 'Disables FAQ item.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FAQ deleted successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FaqsController.prototype, "remove", null);
exports.FaqsController = FaqsController = __decorate([
    (0, swagger_1.ApiTags)('FAQs CMS Module'),
    (0, common_1.Controller)('api/v1/faqs'),
    __metadata("design:paramtypes", [cms_service_1.CMSService])
], FaqsController);
//# sourceMappingURL=faqs.controller.js.map