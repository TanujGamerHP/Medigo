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
exports.CMSController = void 0;
const common_1 = require("@nestjs/common");
const cms_service_1 = require("./cms.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const user_decorator_1 = require("../common/decorators/user.decorator");
const swagger_1 = require("@nestjs/swagger");
let CMSController = class CMSController {
    cmsService;
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    async getAllPages() {
        const data = await this.cmsService.findAllPages();
        return {
            message: 'CMS pages fetched successfully',
            data,
        };
    }
    async getPageBySlug(slug) {
        const data = await this.cmsService.findPageBySlug(slug);
        return {
            message: 'CMS page details fetched successfully',
            data,
        };
    }
    async createPage(title, slug, content, seoTitle, metaDescription, userId) {
        const data = await this.cmsService.createPage(title, slug, content, seoTitle, metaDescription, userId);
        return {
            message: 'CMS page created successfully',
            data,
        };
    }
    async updatePage(id, title, slug, content, seoTitle, metaDescription, userId) {
        const data = await this.cmsService.updatePage(id, title, slug, content, seoTitle, metaDescription, userId);
        return {
            message: 'CMS page updated successfully',
            data,
        };
    }
    async deletePage(id, userId) {
        await this.cmsService.softDeletePage(id, userId);
        return {
            message: 'CMS page soft deleted successfully',
            data: null,
        };
    }
};
exports.CMSController = CMSController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all static CMS pages', description: 'Returns a list of static page titles and slugs.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Static pages list fetched.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CMSController.prototype, "getAllPages", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of specific CMS page by slug', description: 'Returns page body and SEO metadata.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CMS page details returned.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Page not found.' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CMSController.prototype, "getPageBySlug", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new static page (Admin only)', description: 'Records page title, body, and meta headers.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'CMS page created successfully.' }),
    __param(0, (0, common_1.Body)('title')),
    __param(1, (0, common_1.Body)('slug')),
    __param(2, (0, common_1.Body)('content')),
    __param(3, (0, common_1.Body)('seoTitle')),
    __param(4, (0, common_1.Body)('metaDescription')),
    __param(5, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], CMSController.prototype, "createPage", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Modify an existing static page (Admin only)', description: 'Updates page details.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CMS page updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Page not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('slug')),
    __param(3, (0, common_1.Body)('content')),
    __param(4, (0, common_1.Body)('seoTitle')),
    __param(5, (0, common_1.Body)('metaDescription')),
    __param(6, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], CMSController.prototype, "updatePage", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete CMS static page (Admin only)', description: 'Marks page as deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Page deleted successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CMSController.prototype, "deletePage", null);
exports.CMSController = CMSController = __decorate([
    (0, swagger_1.ApiTags)('Static Pages CMS Module'),
    (0, common_1.Controller)('api/v1/cms/pages'),
    __metadata("design:paramtypes", [cms_service_1.CMSService])
], CMSController);
//# sourceMappingURL=cms.controller.js.map