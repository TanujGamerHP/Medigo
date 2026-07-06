import { AssessmentsService } from './assessments.service';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';
export declare class AssessmentsController {
    private assessmentsService;
    constructor(assessmentsService: AssessmentsService);
    start(userId: string): Promise<{
        message: string;
        data: {
            sessionId: string;
            status: string;
            message: string;
        };
    }>;
    submit(userId: string, dto: SubmitAssessmentDto): Promise<{
        message: string;
        data: {
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
        };
    }>;
    getHistory(userId: string): Promise<{
        message: string;
        data: {
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
        }[];
    }>;
    getOne(id: string, userId: string): Promise<{
        message: string;
        data: {
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
        };
    }>;
}
