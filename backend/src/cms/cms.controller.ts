import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CMSService } from './cms.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RequestUser } from '../common/decorators/user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Static Pages CMS Module')
@Controller('api/v1/cms/pages')
export class CMSController {
  constructor(private cmsService: CMSService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all static CMS pages',
    description: 'Returns a list of static page titles and slugs.',
  })
  @ApiResponse({ status: 200, description: 'Static pages list fetched.' })
  async getAllPages() {
    const data = await this.cmsService.findAllPages();
    return {
      message: 'CMS pages fetched successfully',
      data,
    };
  }

  @Get(':slug')
  @ApiOperation({
    summary: 'Get details of specific CMS page by slug',
    description: 'Returns page body and SEO metadata.',
  })
  @ApiResponse({ status: 200, description: 'CMS page details returned.' })
  @ApiResponse({ status: 404, description: 'Page not found.' })
  async getPageBySlug(@Param('slug') slug: string) {
    const data = await this.cmsService.findPageBySlug(slug);
    return {
      message: 'CMS page details fetched successfully',
      data,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new static page (Admin only)',
    description: 'Records page title, body, and meta headers.',
  })
  @ApiResponse({ status: 201, description: 'CMS page created successfully.' })
  async createPage(
    @Body('title') title: string,
    @Body('slug') slug: string,
    @Body('content') content: string,
    @Body('seoTitle') seoTitle: string,
    @Body('metaDescription') metaDescription: string,
    @RequestUser('sub') userId: string,
  ) {
    const data = await this.cmsService.createPage(
      title,
      slug,
      content,
      seoTitle,
      metaDescription,
      userId,
    );
    return {
      message: 'CMS page created successfully',
      data,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Modify an existing static page (Admin only)',
    description: 'Updates page details.',
  })
  @ApiResponse({ status: 200, description: 'CMS page updated successfully.' })
  @ApiResponse({ status: 404, description: 'Page not found.' })
  async updatePage(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('slug') slug: string,
    @Body('content') content: string,
    @Body('seoTitle') seoTitle: string,
    @Body('metaDescription') metaDescription: string,
    @RequestUser('sub') userId: string,
  ) {
    const data = await this.cmsService.updatePage(
      id,
      title,
      slug,
      content,
      seoTitle,
      metaDescription,
      userId,
    );
    return {
      message: 'CMS page updated successfully',
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft delete CMS static page (Admin only)',
    description: 'Marks page as deleted.',
  })
  @ApiResponse({ status: 200, description: 'Page deleted successfully.' })
  async deletePage(
    @Param('id') id: string,
    @RequestUser('sub') userId: string,
  ) {
    await this.cmsService.softDeletePage(id, userId);
    return {
      message: 'CMS page soft deleted successfully',
      data: null,
    };
  }
}
