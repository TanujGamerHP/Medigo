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
exports.BlogsController = void 0;
const common_1 = require("@nestjs/common");
const cms_service_1 = require("./cms.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const user_decorator_1 = require("../common/decorators/user.decorator");
const create_blog_dto_1 = require("./dto/create-blog.dto");
const swagger_1 = require("@nestjs/swagger");
let BlogsController = class BlogsController {
    cmsService;
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    async getAllBlogs() {
        const data = await this.cmsService.findAllBlogs();
        return {
            message: 'Blog articles fetched successfully',
            data,
        };
    }
    async getBlogBySlug(slug) {
        const data = await this.cmsService.findBlogBySlug(slug);
        return {
            message: 'Blog article details fetched successfully',
            data,
        };
    }
    async createBlog(dto, userId) {
        const data = await this.cmsService.createBlog(dto.title, dto.slug, dto.content, dto.category, dto.author, dto.featuredImage, userId);
        return {
            message: 'Blog article created successfully',
            data,
        };
    }
    async updateBlog(id, dto, userId) {
        const data = await this.cmsService.updateBlog(id, dto.title, dto.slug, dto.content, dto.category, dto.author, dto.featuredImage, userId);
        return {
            message: 'Blog article updated successfully',
            data,
        };
    }
    async deleteBlog(id, userId) {
        await this.cmsService.softDeleteBlog(id, userId);
        return {
            message: 'Blog article soft deleted successfully',
            data: null,
        };
    }
};
exports.BlogsController = BlogsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all published blog posts', description: 'Lists active health blogs, authors, and publish timestamps.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog posts list fetched.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getAllBlogs", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get blog post by SEO URL slug', description: 'Retrieves article details using the slug.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog details returned.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Blog post not found.' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getBlogBySlug", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new blog post (Admin only)', description: 'Saves blog article details.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Blog article created successfully.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_dto_1.CreateBlogDto, String]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "createBlog", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Modify an existing blog post (Admin only)', description: 'Updates title, content, or media links.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog post updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Blog post not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_blog_dto_1.CreateBlogDto, String]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "updateBlog", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete blog post (Admin only)', description: 'Marks blog as deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Blog post not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "deleteBlog", null);
exports.BlogsController = BlogsController = __decorate([
    (0, swagger_1.ApiTags)('Blogs CMS Module'),
    (0, common_1.Controller)('api/v1/blogs'),
    __metadata("design:paramtypes", [cms_service_1.CMSService])
], BlogsController);
//# sourceMappingURL=blogs.controller.js.map