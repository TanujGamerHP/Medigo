import { PrismaService } from '../database/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findForUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        userId: string;
        type: string;
        title: string;
        isRead: boolean;
    }[]>;
    markAsRead(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        userId: string;
        type: string;
        title: string;
        isRead: boolean;
    }>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
