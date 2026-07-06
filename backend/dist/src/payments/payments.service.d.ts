import { ConfigService } from '@nestjs/config';
export declare class PaymentsService {
    private configService;
    private razorpay;
    constructor(configService: ConfigService);
    createOrder(amount: number, currency?: string): Promise<any>;
    verifyPayment(orderId: string, paymentId: string, signature: string): boolean;
}
