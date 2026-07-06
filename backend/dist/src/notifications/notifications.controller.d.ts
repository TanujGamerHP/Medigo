import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(userId: string): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            message: string;
            userId: string;
            type: string;
            title: string;
            isRead: boolean;
        }[];
    }>;
    markAllAsRead(userId: string): Promise<{
        message: string;
        data: import("@prisma/client").Prisma.BatchPayload;
    }>;
    markAsRead(id: string, userId: string): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            message: string;
            userId: string;
            type: string;
            title: string;
            isRead: boolean;
        };
    }>;
}
