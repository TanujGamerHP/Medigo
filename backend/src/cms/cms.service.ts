import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CMSService {
  constructor(private prisma: PrismaService) {}

  // --------------------------------------------------
  // CMS Pages
  // --------------------------------------------------
  async findAllPages() {
    return this.prisma.cMSPage.findMany({
      where: { deletedAt: null },
    });
  }

  async findPageBySlug(slug: string) {
    const page = await this.prisma.cMSPage.findFirst({
      where: { slug, deletedAt: null },
    });
    if (!page) {
      throw new NotFoundException(`CMS Page with slug ${slug} not found`);
    }
    return page;
  }

  async createPage(title: string, slug: string, content: string, seoTitle?: string, metaDescription?: string, createdBy?: string) {
    const existing = await this.prisma.cMSPage.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new BadRequestException('CMS Page with this slug already exists');
    }
    return this.prisma.cMSPage.create({
      data: { title, slug, content, seoTitle, metaDescription, createdBy },
    });
  }

  async updatePage(id: string, title: string, slug: string, content: string, seoTitle?: string, metaDescription?: string, updatedBy?: string) {
    const page = await this.prisma.cMSPage.findFirst({
      where: { id, deletedAt: null },
    });
    if (!page) {
      throw new NotFoundException('CMS Page not found');
    }
    return this.prisma.cMSPage.update({
      where: { id },
      data: { title, slug, content, seoTitle, metaDescription, updatedBy },
    });
  }

  async updatePageStatus(id: string, status: string, updatedBy?: string) {
    const page = await this.prisma.cMSPage.findFirst({
      where: { id, deletedAt: null },
    });
    if (!page) {
      throw new NotFoundException('CMS Page not found');
    }
    return this.prisma.cMSPage.update({
      where: { id },
      data: { status, updatedBy },
    });
  }

  async softDeletePage(id: string, updatedBy?: string) {
    const page = await this.prisma.cMSPage.findFirst({
      where: { id, deletedAt: null },
    });
    if (!page) {
      throw new NotFoundException('CMS Page not found');
    }
    return this.prisma.cMSPage.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy },
    });
  }

  // --------------------------------------------------
  // Blogs
  // --------------------------------------------------
  async findAllBlogs() {
    return this.prisma.blog.findMany({
      where: { deletedAt: null },
    });
  }

  async findBlogBySlug(slug: string) {
    const blog = await this.prisma.blog.findFirst({
      where: { slug, deletedAt: null },
    });
    if (!blog) {
      throw new NotFoundException(`Blog article with slug ${slug} not found`);
    }
    return blog;
  }

  async createBlog(title: string, slug: string, content: string, category: string, author: string, featuredImage?: string, createdBy?: string) {
    const existing = await this.prisma.blog.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new BadRequestException('Blog article with this slug already exists');
    }
    return this.prisma.blog.create({
      data: { title, slug, content, category, author, featuredImage, createdBy },
    });
  }

  async updateBlog(id: string, title: string, slug: string, content: string, category: string, author: string, featuredImage?: string, updatedBy?: string) {
    const blog = await this.prisma.blog.findFirst({
      where: { id, deletedAt: null },
    });
    if (!blog) {
      throw new NotFoundException('Blog article not found');
    }
    return this.prisma.blog.update({
      where: { id },
      data: { title, slug, content, category, author, featuredImage, updatedBy },
    });
  }

  async updateBlogStatus(id: string, status: string, updatedBy?: string) {
    const blog = await this.prisma.blog.findFirst({
      where: { id, deletedAt: null },
    });
    if (!blog) {
      throw new NotFoundException('Blog article not found');
    }
    return this.prisma.blog.update({
      where: { id },
      data: { status, updatedBy },
    });
  }

  async softDeleteBlog(id: string, updatedBy?: string) {
    const blog = await this.prisma.blog.findFirst({
      where: { id, deletedAt: null },
    });
    if (!blog) {
      throw new NotFoundException('Blog article not found');
    }
    return this.prisma.blog.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy },
    });
  }

  // --------------------------------------------------
  // FAQs
  // --------------------------------------------------
  async findAllFaqs() {
    return this.prisma.fAQ.findMany({
      where: { deletedAt: null },
    });
  }

  async createFaq(question: string, answer: string, category: string, createdBy?: string) {
    return this.prisma.fAQ.create({
      data: { question, answer, category, createdBy },
    });
  }

  async softDeleteFaq(id: string, updatedBy?: string) {
    const faq = await this.prisma.fAQ.findFirst({
      where: { id, deletedAt: null },
    });
    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }
    return this.prisma.fAQ.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy },
    });
  }

  // --------------------------------------------------
  // Media Library
  // --------------------------------------------------
  async findAllMedia() {
    return this.prisma.media.findMany({
      where: { deletedAt: null },
    });
  }

  async createMedia(fileName: string, fileType: string, fileSize: number, url: string, uploadedBy?: string) {
    return this.prisma.media.create({
      data: { fileName, fileType, fileSize, url, uploadedBy, createdBy: uploadedBy },
    });
  }

  async softDeleteMedia(id: string, updatedBy?: string) {
    const item = await this.prisma.media.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) {
      throw new NotFoundException('Media item not found');
    }
    return this.prisma.media.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy },
    });
  }
}
