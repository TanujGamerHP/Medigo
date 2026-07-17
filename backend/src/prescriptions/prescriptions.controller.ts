import {
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, PrescriptionStatus } from '@prisma/client';
import { RequestUser } from '../common/decorators/user.decorator';
import { DoctorPatientGuard } from '../common/guards/doctor-patient.guard';

@Controller('api/v1/prescriptions')
@UseGuards(JwtAuthGuard, RolesGuard, DoctorPatientGuard)
export class PrescriptionsController {
  constructor(private prescriptionsService: PrescriptionsService) {}

  @Get()
  async getAll() {
    const data = await this.prescriptionsService.findAll();
    return {
      message: 'Prescriptions logs fetched successfully',
      data,
    };
  }

  @Post()
  @Roles(UserRole.Doctor, UserRole.Admin)
  async create(
    @Body('patientId') patientId: string,
    @Body('doctorId') doctorId: string,
    @Body('appointmentId') appointmentId: string | null,
    @Body('diagnosis') diagnosis: string,
    @Body('medications') medications: string,
    @Body('instructions') instructions: string,
    @Body('followUpDate') followUpDateStr: string | null,
    @RequestUser('sub') userId: string,
  ) {
    const followUpDate = followUpDateStr ? new Date(followUpDateStr) : null;
    const data = await this.prescriptionsService.create(
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      medications,
      instructions,
      followUpDate,
      userId,
    );
    return {
      message: 'Prescription issued successfully',
      data,
    };
  }

  @Patch(':id/status')
  @Roles(UserRole.Doctor, UserRole.Admin, UserRole.Pharmacy)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: PrescriptionStatus,
    @RequestUser('sub') userId: string,
  ) {
    const data = await this.prescriptionsService.updateStatus(
      id,
      status,
      userId,
    );
    return {
      message: 'Prescription status updated successfully',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.Doctor, UserRole.Admin)
  async remove(@Param('id') id: string, @RequestUser('sub') userId: string) {
    const data = await this.prescriptionsService.softDelete(id, userId);
    return {
      message: 'Prescription record soft deleted successfully',
      data,
    };
  }
}
