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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMSService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let CMSService = class CMSService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllPages() {
        return this.prisma.cMSPage.findMany({
            where: { deletedAt: null },
        });
    }
    async findPageBySlug(slug) {
        const page = await this.prisma.cMSPage.findFirst({
            where: { slug, deletedAt: null },
        });
        if (!page) {
            throw new common_1.NotFoundException(`CMS Page with slug ${slug} not found`);
        }
        return page;
    }
    async createPage(title, slug, content, seoTitle, metaDescription, createdBy) {
        const existing = await this.prisma.cMSPage.findUnique({
            where: { slug },
        });
        if (existing) {
            throw new common_1.BadRequestException('CMS Page with this slug already exists');
        }
        return this.prisma.cMSPage.create({
            data: { title, slug, content, seoTitle, metaDescription, createdBy },
        });
    }
    async updatePage(id, title, slug, content, seoTitle, metaDescription, updatedBy) {
        const page = await this.prisma.cMSPage.findFirst({
            where: { id, deletedAt: null },
        });
        if (!page) {
            throw new common_1.NotFoundException('CMS Page not found');
        }
        return this.prisma.cMSPage.update({
            where: { id },
            data: { title, slug, content, seoTitle, metaDescription, updatedBy },
        });
    }
    async updatePageStatus(id, status, updatedBy) {
        const page = await this.prisma.cMSPage.findFirst({
            where: { id, deletedAt: null },
        });
        if (!page) {
            throw new common_1.NotFoundException('CMS Page not found');
        }
        return this.prisma.cMSPage.update({
            where: { id },
            data: { status, updatedBy },
        });
    }
    async softDeletePage(id, updatedBy) {
        const page = await this.prisma.cMSPage.findFirst({
            where: { id, deletedAt: null },
        });
        if (!page) {
            throw new common_1.NotFoundException('CMS Page not found');
        }
        return this.prisma.cMSPage.update({
            where: { id },
            data: { deletedAt: new Date(), updatedBy },
        });
    }
    async findAllBlogs() {
        return this.prisma.blog.findMany({
            where: { deletedAt: null },
        });
    }
    async findBlogBySlug(slug) {
        const blog = await this.prisma.blog.findFirst({
            where: { slug, deletedAt: null },
        });
        if (!blog) {
            throw new common_1.NotFoundException(`Blog article with slug ${slug} not found`);
        }
        return blog;
    }
    async createBlog(title, slug, content, category, author, featuredImage, createdBy) {
        const existing = await this.prisma.blog.findUnique({
            where: { slug },
        });
        if (existing) {
            throw new common_1.BadRequestException('Blog article with this slug already exists');
        }
        return this.prisma.blog.create({
            data: { title, slug, content, category, author, featuredImage, createdBy },
        });
    }
    async updateBlog(id, title, slug, content, category, author, featuredImage, updatedBy) {
        const blog = await this.prisma.blog.findFirst({
            where: { id, deletedAt: null },
        });
        if (!blog) {
            throw new common_1.NotFoundException('Blog article not found');
        }
        return this.prisma.blog.update({
            where: { id },
            data: { title, slug, content, category, author, featuredImage, updatedBy },
        });
    }
    async updateBlogStatus(id, status, updatedBy) {
        const blog = await this.prisma.blog.findFirst({
            where: { id, deletedAt: null },
        });
        if (!blog) {
            throw new common_1.NotFoundException('Blog article not found');
        }
        return this.prisma.blog.update({
            where: { id },
            data: { status, updatedBy },
        });
    }
    async softDeleteBlog(id, updatedBy) {
        const blog = await this.prisma.blog.findFirst({
            where: { id, deletedAt: null },
        });
        if (!blog) {
            throw new common_1.NotFoundException('Blog article not found');
        }
        return this.prisma.blog.update({
            where: { id },
            data: { deletedAt: new Date(), updatedBy },
        });
    }
    async findAllFaqs() {
        return this.prisma.fAQ.findMany({
            where: { deletedAt: null },
        });
    }
    async createFaq(question, answer, category, createdBy) {
        return this.prisma.fAQ.create({
            data: { question, answer, category, createdBy },
        });
    }
    async softDeleteFaq(id, updatedBy) {
        const faq = await this.prisma.fAQ.findFirst({
            where: { id, deletedAt: null },
        });
        if (!faq) {
            throw new common_1.NotFoundException('FAQ not found');
        }
        return this.prisma.fAQ.update({
            where: { id },
            data: { deletedAt: new Date(), updatedBy },
        });
    }
    async findAllMedia() {
        return this.prisma.media.findMany({
            where: { deletedAt: null },
        });
    }
    async createMedia(fileName, fileType, fileSize, url, uploadedBy) {
        return this.prisma.media.create({
            data: { fileName, fileType, fileSize, url, uploadedBy, createdBy: uploadedBy },
        });
    }
    async softDeleteMedia(id, updatedBy) {
        const item = await this.prisma.media.findFirst({
            where: { id, deletedAt: null },
        });
        if (!item) {
            throw new common_1.NotFoundException('Media item not found');
        }
        return this.prisma.media.update({
            where: { id },
            data: { deletedAt: new Date(), updatedBy },
        });
    }
};
exports.CMSService = CMSService;
exports.CMSService = CMSService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CMSService);
//# sourceMappingURL=cms.service.js.map