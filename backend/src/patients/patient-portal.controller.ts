import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RequestUser } from '../common/decorators/user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Patient Portal Module')
@ApiBearerAuth()
@Controller('api/v1/patient')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Patient)
export class PatientPortalController {
  constructor(private patientsService: PatientsService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get logged-in patient profile', description: 'Returns the personal and clinical profile details of the patient.' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully.' })
  async getProfile(@RequestUser('sub') userId: string) {
    const data = await this.patientsService.findProfileByUserId(userId);
    return {
      message: 'Patient profile retrieved successfully',
      data,
    };
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update patient profile info', description: 'Accepts customizable parameters like height, weight, and emergency details.' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  async updateProfile(
    @RequestUser('sub') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    const data = await this.patientsService.updateProfileByUserId(userId, dto);
    return {
      message: 'Patient profile updated successfully',
      data,
    };
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get patient dashboard summary KPIs', description: 'Fetches active prescriptions, upcoming appointments, BMI tracker, and status.' })
  @ApiResponse({ status: 200, description: 'KPI dataset returned.' })
  async getDashboard(@RequestUser('sub') userId: string) {
    const data = await this.patientsService.getDashboardData(userId);
    return {
      message: 'Patient dashboard summary statistics compiled successfully',
      data,
    };
  }

  @Get('appointments')
  @ApiOperation({ summary: 'Get all patient consultations', description: 'Lists past and upcoming appointments of the user.' })
  @ApiResponse({ status: 200, description: 'Appointments list fetched.' })
  async getAppointments(@RequestUser('sub') userId: string) {
    const data = await this.patientsService.getPatientAppointments(userId);
    return {
      message: 'Patient consultations queue retrieved successfully',
      data,
    };
  }

  @Get('prescriptions')
  @ApiOperation({ summary: 'Get patient prescriptions logs', description: 'Lists all issued, active, or refilled medication prescriptions.' })
  @ApiResponse({ status: 200, description: 'Prescriptions logs fetched.' })
  async getPrescriptions(@RequestUser('sub') userId: string) {
    const data = await this.patientsService.getPatientPrescriptions(userId);
    return {
      message: 'Patient prescriptions list retrieved successfully',
      data,
    };
  }

  @Get('membership')
  @ApiOperation({ summary: 'Get patient active membership tier details', description: 'Returns active plan history.' })
  @ApiResponse({ status: 200, description: 'Membership info retrieved.' })
  async getMembership(@RequestUser('sub') userId: string) {
    const data = await this.patientsService.getPatientMembership(userId);
    return {
      message: 'Patient membership status retrieved successfully',
      data,
    };
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Get patient account notifications', description: 'Lists all email or in-app alerts dispatched.' })
  @ApiResponse({ status: 200, description: 'Alert logs compiled.' })
  async getNotifications(@RequestUser('sub') userId: string) {
    const data = await this.patientsService.getPatientNotifications(userId);
    return {
      message: 'Patient alerts list retrieved successfully',
      data,
    };
  }
}
