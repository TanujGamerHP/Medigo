import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, DoctorStatus } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Doctors Listing Module')
@Controller('api/v1/doctors')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  @Get('availability')
  @ApiOperation({
    summary: 'Get doctor clinical availability hours',
    description:
      'Lists working days, timeslots, and general status of all practitioners.',
  })
  @ApiResponse({ status: 200, description: 'Availability logs fetched.' })
  async getAvailability() {
    const data = await this.doctorsService.getAvailability();
    return {
      message: 'Doctors availability schedules retrieved successfully',
      data,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'List all registered doctors',
    description: 'Returns a list of doctors and specialties.',
  })
  @ApiResponse({ status: 200, description: 'Doctors list fetched.' })
  async getAll() {
    const data = await this.doctorsService.findAll();
    return {
      message: 'Doctors list fetched successfully',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details of specific doctor profile',
    description: 'Retrieves info by doctor record ID.',
  })
  @ApiResponse({ status: 200, description: 'Doctor profile returned.' })
  @ApiResponse({ status: 404, description: 'Doctor profile not found.' })
  async getOne(@Param('id') id: string) {
    const data = await this.doctorsService.findOne(id);
    return {
      message: 'Doctor details fetched successfully',
      data,
    };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update doctor credential status (Admin only)',
    description: 'Locks, verifies, or suspends doctor profile.',
  })
  @ApiResponse({ status: 200, description: 'Doctor status updated.' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: DoctorStatus,
  ) {
    const data = await this.doctorsService.updateStatus(id, status);
    return {
      message: 'Doctor verification status updated successfully',
      data,
    };
  }
}
