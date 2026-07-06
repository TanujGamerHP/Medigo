import { Controller, Get, Post, Param, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, AppointmentStatus } from '@prisma/client';
import { RequestUser } from '../common/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Appointments Module')
@ApiBearerAuth()
@Controller('api/v1/appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all appointments', description: 'Returns a list of appointments in the system.' })
  @ApiResponse({ status: 200, description: 'Appointments queue fetched successfully.' })
  async getAll(@RequestUser() user: any) {
    let data;
    if (user.role === 'Admin') {
      data = await this.appointmentsService.findAll();
    } else if (user.role === 'Doctor') {
      data = await this.appointmentsService.findByDoctorUserId(user.sub);
    } else {
      data = await this.appointmentsService.findByPatientUserId(user.sub);
    }
    return {
      message: 'Appointments queue fetched successfully',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific appointment', description: 'Retrieves appointment details by record ID.' })
  @ApiResponse({ status: 200, description: 'Appointment details retrieved.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  async getOne(@Param('id') id: string) {
    const data = await this.appointmentsService.findOne(id);
    return {
      message: 'Appointment details retrieved successfully',
      data,
    };
  }

  @Patch(':id/meeting-link')
  @Roles(UserRole.Doctor)
  @ApiOperation({ summary: 'Update meeting link', description: 'Sets the meeting link for a video consultation.' })
  async updateMeetingLink(
    @Param('id') id: string,
    @Body('meetingLink') meetingLink: string,
  ) {
    const data = await this.appointmentsService.updateMeetingLink(id, meetingLink);
    return {
      message: 'Meeting link updated successfully',
      data,
    };
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get messages for an appointment', description: 'Retrieves chat messages for a text consultation.' })
  async getMessages(@Param('id') id: string) {
    const data = await this.appointmentsService.getMessages(id);
    return {
      message: 'Messages retrieved successfully',
      data,
    };
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message', description: 'Sends a text message in a chat consultation.' })
  async sendMessage(
    @Param('id') id: string,
    @Body('text') text: string,
    @RequestUser('sub') userId: string,
  ) {
    const data = await this.appointmentsService.createMessage(id, userId, text);
    return {
      message: 'Message sent successfully',
      data,
    };
  }

  @Post()
  @Roles(UserRole.Patient, UserRole.Admin)
  @ApiOperation({ summary: 'Book a new consultation slot', description: 'Registers a new pending appointment slot.' })
  @ApiResponse({ status: 201, description: 'Appointment booked successfully.' })
  async create(
    @Body('doctorId') doctorId: string,
    @Body('appointmentDate') appointmentDate: string,
    @Body('appointmentTime') appointmentTime: string,
    @Body('consultationType') consultationType: string,
    @RequestUser('sub') userId: string,
  ) {
    const data = await this.appointmentsService.createForUser(userId, doctorId, appointmentDate, appointmentTime, consultationType);
    return {
      message: 'Appointment booked successfully',
      data,
    };
  }

  @Patch(':id')
  @Roles(UserRole.Patient, UserRole.Admin)
  @ApiOperation({ summary: 'Reschedule an existing consultation slot', description: 'Updates date and time parameters.' })
  @ApiResponse({ status: 200, description: 'Appointment rescheduled successfully.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['appointmentDate', 'appointmentTime'],
      properties: {
        appointmentDate: { type: 'string', example: '2026-07-20' },
        appointmentTime: { type: 'string', example: '14:30' },
      },
    },
  })
  async reschedule(
    @Param('id') id: string,
    @Body('appointmentDate') appointmentDate: string,
    @Body('appointmentTime') appointmentTime: string,
    @RequestUser('sub') userId: string,
  ) {
    const data = await this.appointmentsService.reschedule(id, appointmentDate, appointmentTime, userId);
    return {
      message: 'Appointment rescheduled successfully',
      data,
    };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update appointment status', description: 'Sets status to Confirmed, Completed, Cancelled, etc.' })
  @ApiResponse({ status: 200, description: 'Appointment status updated successfully.' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['status'],
      properties: {
        status: { type: 'string', enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'NoShow'] },
      },
    },
  })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus,
    @RequestUser('sub') userId: string,
  ) {
    const data = await this.appointmentsService.updateStatus(id, status, userId);
    return {
      message: 'Appointment status updated successfully',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.Admin, UserRole.Patient)
  @ApiOperation({ summary: 'Cancel and soft-delete appointment', description: 'Marks appointment as deleted.' })
  @ApiResponse({ status: 200, description: 'Appointment cancelled and soft deleted successfully.' })
  async remove(
    @Param('id') id: string,
    @RequestUser('sub') userId: string,
  ) {
    const data = await this.appointmentsService.softDelete(id, userId);
    return {
      message: 'Appointment cancelled and soft deleted successfully',
      data,
    };
  }

  @Post(':id/complete')
  @Roles(UserRole.Doctor)
  @ApiOperation({ summary: 'Submit consultation report and complete session', description: 'Restricted to assigned doctor. Creates clinical report, issues prescription, and updates status.' })
  @ApiResponse({ status: 200, description: 'Consultation completed successfully.' })
  async complete(
    @Param('id') id: string,
    @Body() data: any,
    @RequestUser('sub') userId: string,
  ) {
    const result = await this.appointmentsService.completeConsultation(id, userId, data);
    return {
      message: 'Consultation completed and report submitted successfully',
      data: result,
    };
  }
}
