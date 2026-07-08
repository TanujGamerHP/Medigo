import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Admin Portal Module')
@ApiBearerAuth()
@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
export class AdminPortalController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get Admin dashboard KPIs',
    description:
      'Returns platform-wide metrics: total user roles, consultations, and revenue logs.',
  })
  @ApiResponse({ status: 200, description: 'Metrics successfully aggregated.' })
  async getDashboard() {
    const data = await this.adminService.getDashboardStats();
    return {
      message: 'Admin dashboard statistics compiled successfully',
      data,
    };
  }

  @Get('users')
  @ApiOperation({
    summary: 'List all registered system user accounts',
    description: 'Supports pagination, search by phone or email, and sorting.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated user account logs returned.',
  })
  async getUsers(@Query() query: PaginationQueryDto) {
    const data = await this.adminService.getUsers(query);
    return {
      message: 'User account logs fetched successfully',
      data,
    };
  }

  @Get('doctors')
  @ApiOperation({
    summary: 'List all registered clinic doctors',
    description: 'Returns full doctor profile details.',
  })
  @ApiResponse({ status: 200, description: 'Doctors list fetched.' })
  async getDoctors() {
    const data = await this.adminService.getDoctors();
    return {
      message: 'Doctors profiles retrieved successfully',
      data,
    };
  }

  @Get('patients')
  @ApiOperation({
    summary: 'List all registered patients',
    description: 'Returns full patient profiles.',
  })
  @ApiResponse({ status: 200, description: 'Patients list fetched.' })
  async getPatients() {
    const data = await this.adminService.getPatients();
    return {
      message: 'Patients profiles retrieved successfully',
      data,
    };
  }

  @Get('reports')
  @ApiOperation({
    summary: 'Get administrative audit log report',
    description: 'Fetches recent security and execution log traces.',
  })
  @ApiResponse({ status: 200, description: 'Security audit logs returned.' })
  async getReports() {
    const data = await this.adminService.getReports();
    return {
      message: 'Security audit logs compiled successfully',
      data,
    };
  }

  @Put('user/:id')
  @ApiOperation({
    summary: 'Update user status or permissions role',
    description: 'Modifies permissions of a user profile.',
  })
  @ApiResponse({ status: 200, description: 'User account updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const data = await this.adminService.updateUser(id, dto);
    return {
      message: 'User profile updated successfully',
      data,
    };
  }

  @Delete('user/:id')
  @ApiOperation({
    summary: 'Soft delete user account',
    description: 'Disables access and marks deletedAt timestamp.',
  })
  @ApiResponse({ status: 200, description: 'User soft-deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async removeUser(@Param('id') id: string) {
    await this.adminService.deleteUser(id);
    return {
      message: 'User account soft deleted successfully',
      data: null,
    };
  }
}
