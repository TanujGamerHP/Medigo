import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('public')
  @ApiOperation({ summary: 'Get public reviews for home page' })
  findPublicHome() {
    return this.reviewsService.findPublic();
  }

  @Get('public/rating/:stars')
  @ApiOperation({ summary: 'Get public reviews by rating' })
  findPublicByRating(@Param('stars') stars: string) {
    return this.reviewsService.findPublic(parseInt(stars, 10));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new review (Admin)' })
  create(@Body() createData: any) {
    return this.reviewsService.create(createData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all reviews (Admin)' })
  findAll() {
    return this.reviewsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a review (Admin)' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.reviewsService.update(id, updateData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review (Admin)' })
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
