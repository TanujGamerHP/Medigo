import { MembershipsService } from './memberships.service';
import { SubscribeDto } from './dto/subscribe.dto';
export declare class MembershipsController {
    private membershipsService;
    constructor(membershipsService: MembershipsService);
    getPlans(): Promise<{
        message: string;
        data: {
            name: string;
            price: number;
            billing: string;
            description: string;
        }[];
    }>;
    subscribe(userId: string, dto: SubscribeDto): Promise<{
        message: string;
        data: {
            id: string;
            status: import("@prisma/client").$Enums.MembershipStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            planName: string;
            startDate: Date;
            expiryDate: Date;
            price: number;
            patientId: string;
        };
    }>;
    getHistory(userId: string): Promise<{
        message: string;
        data: {
            id: string;
            status: import("@prisma/client").$Enums.MembershipStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            planName: string;
            startDate: Date;
            expiryDate: Date;
            price: number;
            patientId: string;
        }[];
    }>;
}
