import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CMSService } from './cms.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RequestUser } from '../common/decorators/user.decorator';
import { CreateBlogDto } from './dto/create-blog.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Blogs CMS Module')
@Controller('api/v1/blogs')
export class BlogsController {
  constructor(private cmsService: CMSService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all published blog posts', description: 'Lists active health blogs, authors, and publish timestamps.' })
  @ApiResponse({ status: 200, description: 'Blog posts list fetched.' })
  async getAllBlogs() {
    const data = await this.cmsService.findAllBlogs();
    return {
      message: 'Blog articles fetched successfully',
      data,
    };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get blog post by SEO URL slug', description: 'Retrieves article details using the slug.' })
  @ApiResponse({ status: 200, description: 'Blog details returned.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  async getBlogBySlug(@Param('slug') slug: string) {
    const data = await this.cmsService.findBlogBySlug(slug);
    return {
      message: 'Blog article details fetched successfully',
      data,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new blog post (Admin only)', description: 'Saves blog article details.' })
  @ApiResponse({ status: 201, description: 'Blog article created successfully.' })
  async createBlog(
    @Body() dto: CreateBlogDto,
    @RequestUser('sub') userId: string,
  ) {
    const data = await this.cmsService.createBlog(
      dto.title,
      dto.slug,
      dto.content,
      dto.category,
      dto.author,
      dto.featuredImage,
      userId,
    );
    return {
      message: 'Blog article created successfully',
      data,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modify an existing blog post (Admin only)', description: 'Updates title, content, or media links.' })
  @ApiResponse({ status: 200, description: 'Blog post updated successfully.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  async updateBlog(
    @Param('id') id: string,
    @Body() dto: CreateBlogDto,
    @RequestUser('sub') userId: string,
  ) {
    const data = await this.cmsService.updateBlog(
      id,
      dto.title,
      dto.slug,
      dto.content,
      dto.category,
      dto.author,
      dto.featuredImage,
      userId,
    );
    return {
      message: 'Blog article updated successfully',
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete blog post (Admin only)', description: 'Marks blog as deleted.' })
  @ApiResponse({ status: 200, description: 'Blog deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  async deleteBlog(
    @Param('id') id: string,
    @RequestUser('sub') userId: string,
  ) {
    await this.cmsService.softDeleteBlog(id, userId);
    return {
      message: 'Blog article soft deleted successfully',
      data: null,
    };
  }
}
