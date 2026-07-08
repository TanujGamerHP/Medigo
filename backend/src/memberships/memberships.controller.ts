import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RequestUser } from '../common/decorators/user.decorator';
import { SubscribeDto } from './dto/subscribe.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Membership Module')
@Controller('api/v1/membership')
export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  @Get('plans')
  @ApiOperation({
    summary: 'Retrieve available weight management subscription plans',
    description: 'Lists all starter, premium, and elite monthly billing tiers.',
  })
  @ApiResponse({ status: 200, description: 'List of plans returned.' })
  async getPlans() {
    const data = await this.membershipsService.getPlans();
    return {
      message: 'Subscription plans fetched successfully',
      data,
    };
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Patient)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Subscribe to a billing plan',
    description:
      'Locks in a plan tier for the current patient and processes checkout.',
  })
  @ApiResponse({
    status: 201,
    description: 'Subscription created and activated successfully.',
  })
  async subscribe(
    @RequestUser('sub') userId: string,
    @Body() dto: SubscribeDto,
  ) {
    const data = await this.membershipsService.subscribe(userId, dto);
    return {
      message: 'Subscribed to plan successfully',
      data,
    };
  }

  @Get('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Patient)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get patient membership subscription history',
    description: 'Retrieves all past and active plans of the patient.',
  })
  @ApiResponse({ status: 200, description: 'Subscription logs returned.' })
  async getHistory(@RequestUser('sub') userId: string) {
    const data = await this.membershipsService.getHistory(userId);
    return {
      message: 'Subscription logs retrieved successfully',
      data,
    };
  }
}
