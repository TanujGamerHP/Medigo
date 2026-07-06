import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CMSService } from './cms.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RequestUser } from '../common/decorators/user.decorator';
import { CreateFaqDto } from './dto/create-faq.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('FAQs CMS Module')
@Controller('api/v1/faqs')
export class FaqsController {
  constructor(private cmsService: CMSService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all general and medication FAQs', description: 'Lists all available collapsible questions and answers.' })
  @ApiResponse({ status: 200, description: 'FAQs list fetched.' })
  async getAll() {
    const data = await this.cmsService.findAllFaqs();
    return {
      message: 'FAQs fetched successfully',
      data,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new FAQ record (Admin only)', description: 'Saves collapsible item details.' })
  @ApiResponse({ status: 201, description: 'FAQ created successfully.' })
  async create(
    @Body() dto: CreateFaqDto,
    @RequestUser('sub') userId: string,
  ) {
    const data = await this.cmsService.createFaq(dto.question, dto.answer, dto.category, userId);
    return {
      message: 'FAQ created successfully',
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete FAQ record (Admin only)', description: 'Disables FAQ item.' })
  @ApiResponse({ status: 200, description: 'FAQ deleted successfully.' })
  async remove(
    @Param('id') id: string,
    @RequestUser('sub') userId: string,
  ) {
    await this.cmsService.softDeleteFaq(id, userId);
    return {
      message: 'FAQ soft deleted successfully',
      data: null,
    };
  }
}
