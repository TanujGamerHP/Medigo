import { PrismaService } from '../database/prisma.service';
import { SubscribeDto } from './dto/subscribe.dto';
export declare class MembershipsService {
    private prisma;
    constructor(prisma: PrismaService);
    getPlans(): Promise<{
        name: string;
        price: number;
        billing: string;
        description: string;
    }[]>;
    subscribe(userId: string, dto: SubscribeDto): Promise<{
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
    }>;
    getHistory(userId: string): Promise<{
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
    }[]>;
}
