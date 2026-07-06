import { CMSService } from './cms.service';
import { CreateFaqDto } from './dto/create-faq.dto';
export declare class FaqsController {
    private cmsService;
    constructor(cmsService: CMSService);
    getAll(): Promise<{
        message: string;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            category: string;
            question: string;
            answer: string;
        }[];
    }>;
    create(dto: CreateFaqDto, userId: string): Promise<{
        message: string;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            category: string;
            question: string;
            answer: string;
        };
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
        data: null;
    }>;
}
