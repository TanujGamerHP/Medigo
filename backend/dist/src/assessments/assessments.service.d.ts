import { PrismaService } from '../database/prisma.service';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';
export declare class AssessmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    startSession(userId: string): Promise<{
        sessionId: string;
        status: string;
        message: string;
    }>;
    submitAssessment(userId: string, dto: SubmitAssessmentDto): Promise<{
        assessmentId: string;
        bmi: number;
        result: string;
        recommendation: string;
        submittedAt: Date;
        matchedDoctors: {
            id: string;
            name: string;
            specialization: string;
            consultationFee: number;
        }[];
    }>;
    getHistory(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        result: string;
        createdBy: string | null;
        updatedBy: string | null;
        patientId: string;
        assessmentScore: number;
        bmi: number;
        recommendation: string;
        submittedAt: Date;
    }[]>;
    getOne(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        result: string;
        createdBy: string | null;
        updatedBy: string | null;
        patientId: string;
        assessmentScore: number;
        bmi: number;
        recommendation: string;
        submittedAt: Date;
    }>;
}
