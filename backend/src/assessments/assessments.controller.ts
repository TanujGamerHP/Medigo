import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RequestUser } from '../common/decorators/user.decorator';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Assessments Module')
@ApiBearerAuth()
@Controller('api/v1/assessment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssessmentsController {
  constructor(private assessmentsService: AssessmentsService) {}

  @Post('start')
  @Roles(UserRole.Patient)
  @ApiOperation({ summary: 'Start a new assessment session', description: 'Initiates a new multi-step AI assessment session.' })
  @ApiResponse({ status: 201, description: 'Session successfully started.' })
  async start(@RequestUser('sub') userId: string) {
    const data = await this.assessmentsService.startSession(userId);
    return {
      message: 'Assessment session started',
      data,
    };
  }

  @Post('submit')
  @Roles(UserRole.Patient)
  @ApiOperation({ summary: 'Submit completed assessment questionnaire', description: 'Accepts questionnaire criteria, computes BMI and matching plans/doctors.' })
  @ApiResponse({ status: 201, description: 'Intake answers evaluated and saved successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  async submit(
    @RequestUser('sub') userId: string,
    @Body() dto: SubmitAssessmentDto,
  ) {
    const data = await this.assessmentsService.submitAssessment(userId, dto);
    return {
      message: 'Assessment evaluation completed successfully',
      data,
    };
  }

  @Get('history')
  @Roles(UserRole.Patient)
  @ApiOperation({ summary: 'Get assessment history', description: 'Lists all past assessment records submitted by the logged-in patient.' })
  @ApiResponse({ status: 200, description: 'Evaluation history fetched.' })
  async getHistory(@RequestUser('sub') userId: string) {
    const data = await this.assessmentsService.getHistory(userId);
    return {
      message: 'Assessment evaluation history fetched successfully',
      data,
    };
  }

  @Get(':id')
  @Roles(UserRole.Patient)
  @ApiOperation({ summary: 'Get details of specific assessment record', description: 'Retrieves a single past evaluation by record ID.' })
  @ApiResponse({ status: 200, description: 'Evaluation record details returned.' })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async getOne(
    @Param('id') id: string,
    @RequestUser('sub') userId: string,
  ) {
    const data = await this.assessmentsService.getOne(id, userId);
    return {
      message: 'Assessment record details retrieved successfully',
      data,
    };
  }
}
