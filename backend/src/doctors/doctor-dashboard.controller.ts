import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { PrescriptionsService } from '../prescriptions/prescriptions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RequestUser } from '../common/decorators/user.decorator';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Doctor Dashboard Module')
@ApiBearerAuth()
@Controller('api/v1/doctor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Doctor)
export class DoctorDashboardController {
  constructor(
    private doctorsService: DoctorsService,
    private prescriptionsService: PrescriptionsService,
  ) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get doctor dashboard KPIs',
    description:
      'Returns upcoming appointments count, pending assessments, and clinic profile status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard metrics successfully returned.',
  })
  async getDashboard(@RequestUser('sub') userId: string) {
    const data = await this.doctorsService.getDashboardData(userId);
    return {
      message: 'Doctor dashboard summary statistics compiled successfully',
      data,
    };
  }

  @Get('appointments')
  @ApiOperation({
    summary: 'List all consultations scheduled with this doctor',
    description:
      'Returns list of appointments with linked patient name and date.',
  })
  @ApiResponse({ status: 200, description: 'Appointments list fetched.' })
  async getAppointments(@RequestUser('sub') userId: string) {
    const data = await this.doctorsService.getDoctorAppointments(userId);
    return {
      message: 'Doctor consultations queue retrieved successfully',
      data,
    };
  }

  @Get('patients')
  @ApiOperation({
    summary: 'List all unique patients seen by this doctor',
    description: 'Returns a list of patients.',
  })
  @ApiResponse({ status: 200, description: 'Unique patients list fetched.' })
  async getPatients(@RequestUser('sub') userId: string) {
    const data = await this.doctorsService.getDoctorPatients(userId);
    return {
      message: 'Doctor patients list retrieved successfully',
      data,
    };
  }

  @Get('assessments')
  @ApiOperation({
    summary: 'List all assessments for patients of this doctor',
    description: 'Returns a list of assessments for patients assigned to or consulted by this doctor.',
  })
  @ApiResponse({ status: 200, description: 'Patient assessments fetched successfully.' })
  async getAssessments(@RequestUser('sub') userId: string) {
    const data = await this.doctorsService.getDoctorPatientsAssessments(userId);
    return {
      message: 'Patient assessments retrieved successfully',
      data,
    };
  }

  @Get('patient/:id')
  @ApiOperation({
    summary: 'Get detailed history and prescriptions of a patient',
    description: 'Retrieves patient timeline specific to this doctor.',
  })
  @ApiResponse({
    status: 200,
    description: 'Patient details and history returned.',
  })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  async getPatientDetails(
    @RequestUser('sub') userId: string,
    @Param('id') patientId: string,
  ) {
    const data = await this.doctorsService.getDoctorPatientDetails(
      userId,
      patientId,
    );
    return {
      message: 'Patient records and history retrieved successfully',
      data,
    };
  }

  @Post('prescriptions')
  @ApiOperation({
    summary: 'Issue a new prescription for a patient',
    description:
      'Records diagnosis, medication instructions, and check-up follow-up.',
  })
  @ApiResponse({
    status: 201,
    description: 'Prescription created successfully.',
  })
  async createPrescription(
    @RequestUser('sub') userId: string,
    @Body() dto: CreatePrescriptionDto,
  ) {
    const doctor = await this.doctorsService.findProfileByUserId(userId);
    const followUpDate = dto.followUpDate ? new Date(dto.followUpDate) : null;

    const data = await this.prescriptionsService.create(
      dto.patientId,
      doctor.id,
      dto.appointmentId || null,
      dto.diagnosis,
      dto.medications,
      dto.instructions,
      followUpDate,
      userId,
    );
    return {
      message: 'Prescription issued successfully',
      data,
    };
  }

  @Put('prescriptions/:id')
  @ApiOperation({
    summary: 'Modify an active prescription',
    description: 'Updates diagnosis or dosage directions.',
  })
  @ApiResponse({
    status: 200,
    description: 'Prescription updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Prescription not found.' })
  async updatePrescription(
    @RequestUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: CreatePrescriptionDto,
  ) {
    const followUpDate = dto.followUpDate ? new Date(dto.followUpDate) : null;
    const data = await this.prescriptionsService.update(
      id,
      dto.diagnosis,
      dto.medications,
      dto.instructions,
      followUpDate,
      userId,
    );
    return {
      message: 'Prescription updated successfully',
      data,
    };
  }

  @Get('availability')
  @ApiOperation({
    summary: 'Get current practitioner schedule status',
    description: 'Returns Available/Busy/OutOfOffice.',
  })
  @ApiResponse({ status: 200, description: 'Availability status fetched.' })
  async getAvailability(@RequestUser('sub') userId: string) {
    const doctor = await this.doctorsService.findProfileByUserId(userId);
    return {
      message: 'Practitioner availability status retrieved successfully',
      data: {
        availabilityStatus: doctor.availabilityStatus,
      },
    };
  }

  @Put('availability')
  @ApiOperation({
    summary: 'Update practitioner schedule status',
    description: 'Updates state to Available, Busy, or OutOfOffice.',
  })
  @ApiResponse({
    status: 200,
    description: 'Availability status updated successfully.',
  })
  async updateAvailability(
    @RequestUser('sub') userId: string,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    const data = await this.doctorsService.updateAvailability(
      userId,
      dto.status,
    );
    return {
      message: 'Practitioner availability status updated successfully',
      data,
    };
  }

  @Put('profile')
  @ApiOperation({
    summary: 'Update practitioner profile and fee',
    description: 'Updates specialization, experience, and consultation fee.',
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  async updateProfile(@RequestUser('sub') userId: string, @Body() dto: any) {
    const data = await this.doctorsService.updateProfile(userId, dto);
    return {
      message: 'Practitioner profile updated successfully',
      data,
    };
  }
}
