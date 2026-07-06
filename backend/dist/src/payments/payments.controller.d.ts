import { PaymentsService } from './payments.service';
import { AppointmentsService } from '../appointments/appointments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly appointmentsService;
    constructor(paymentsService: PaymentsService, appointmentsService: AppointmentsService);
    createOrder(amount: number, currency: string): Promise<{
        success: boolean;
        data: any;
    }>;
    verifyPayment(orderId: string, paymentId: string, signature: string, appointmentDetails: any, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            patientId: string;
            doctorId: string;
            appointmentDate: string;
            appointmentTime: string;
            consultationType: string;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            notes: string | null;
            meetingLink: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
        };
    }>;
}
