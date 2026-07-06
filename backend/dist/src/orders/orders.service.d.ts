import { PrismaService } from '../database/prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    checkout(userId: string, productId: string, quantity: number, shippingAddress: string): Promise<{
        items: {
            id: string;
            price: number;
            quantity: number;
            productId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        totalAmount: number;
        status: string;
        paymentId: string | null;
        shippingAddress: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        patientId: string;
    }>;
    getHistory(userId: string): Promise<({
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                name: string;
                description: string;
                price: number;
                stock: number;
                imageUrl: string | null;
                category: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            price: number;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        totalAmount: number;
        status: string;
        paymentId: string | null;
        shippingAddress: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        patientId: string;
    })[]>;
}
