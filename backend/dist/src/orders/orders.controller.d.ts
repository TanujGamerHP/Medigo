import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    checkout(userId: string, productId: string, quantity: number, shippingAddress: string): Promise<{
        message: string;
        data: {
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
        };
    }>;
    getHistory(userId: string): Promise<{
        message: string;
        data: ({
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
        })[];
    }>;
}
