import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';

@Injectable()
export class AssessmentsService {
  constructor(private prisma: PrismaService) {}

  async startSession(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException(
        'Patient profile not found. Complete profile intake first.',
      );
    }

    return {
      sessionId: `sess-${Math.random().toString(36).substring(2, 9)}`,
      status: 'Ready',
      message: 'Assessment session initiated successfully',
    };
  }

  async submitAssessment(userId: string, dto: SubmitAssessmentDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException(
        'Patient profile not found. Complete profile intake first.',
      );
    }

    // BMI: weight (kg) / height^2 (m)
    const bmi = parseFloat((dto.weight / (dto.height * dto.height)).toFixed(2));

    let result = 'Normal Weight';
    let recommendation =
      'Maintain a balanced diet and regular physical activity.';

    if (bmi >= 30) {
      result = 'Obese';
      recommendation =
        'Recommended for Wegovy / Mounjaro medical weight management programs.';
    } else if (bmi >= 25) {
      result = 'Overweight';
      recommendation =
        'Recommended for Semaglutide (Ozempic) weight loss programs.';
    } else if (bmi < 18.5) {
      result = 'Underweight';
      recommendation = 'Recommended for personalized nutritional therapy.';
    }

    // Save assessment record
    const assessment = await this.prisma.assessment.create({
      data: {
        patientId: patient.id,
        assessmentScore: Math.round(bmi), // Use BMI round as score representative
        bmi,
        result,
        recommendation,
        createdBy: userId,
      },
    });

    // Update patient profile with new weight and height
    await this.prisma.patient.update({
      where: { id: patient.id },
      data: {
        weight: dto.weight,
        height: dto.height * 100, // stored in cm in db presumably, since frontend sends it in cm during setup
      },
    });

    // Match 2 available doctors
    const matchedDoctors = await this.prisma.doctor.findMany({
      take: 2,
      where: {
        deletedAt: null,
        availabilityStatus: 'Available',
        status: 'Verified',
      },
    });

    return {
      assessmentId: assessment.id,
      bmi,
      result,
      recommendation,
      submittedAt: assessment.submittedAt,
      matchedDoctors: matchedDoctors.map((doc) => ({
        id: doc.id,
        name: `Dr. ${doc.firstName} ${doc.lastName}`,
        specialization: doc.specialization,
        consultationFee: doc.consultationFee,
      })),
    };
  }

  async getHistory(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found.');
    }

    return this.prisma.assessment.findMany({
      where: { patientId: patient.id, deletedAt: null },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async getOne(id: string, userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found.');
    }

    const assessment = await this.prisma.assessment.findFirst({
      where: { id, patientId: patient.id, deletedAt: null },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment record not found.');
    }

    return assessment;
  }
}
