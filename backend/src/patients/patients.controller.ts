import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { DoctorPatientGuard } from '../common/guards/doctor-patient.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, PatientStatus } from '@prisma/client';

@Controller('api/v1/patients')
@UseGuards(JwtAuthGuard, RolesGuard, DoctorPatientGuard)
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Get()
  @Roles(UserRole.Admin, UserRole.Doctor)
  async getAll() {
    const data = await this.patientsService.findAll();
    return {
      message: 'Patients list fetched successfully',
      data,
    };
  }

  @Get(':id')
  @Roles(UserRole.Admin, UserRole.Doctor, UserRole.Pharmacy, UserRole.Lab)
  async getOne(@Param('id') id: string) {
    const data = await this.patientsService.findOne(id);
    return {
      message: 'Patient details fetched successfully',
      data,
    };
  }

  @Patch(':id/status')
  @Roles(UserRole.Admin)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: PatientStatus,
  ) {
    const data = await this.patientsService.updateStatus(id, status);
    return {
      message: 'Patient status updated successfully',
      data,
    };
  }
}
