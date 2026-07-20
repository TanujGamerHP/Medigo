import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequestUser } from '../common/decorators/user.decorator';
import { NotificationsService } from '../notifications/notifications.service';

import { PrismaService } from '../database/prisma.service';

@Controller('api/v1/payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly appointmentsService: AppointmentsService,
    private readonly notificationsService: NotificationsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body('amount') amount: number,
    @Body('currency') currency: string,
    @Body('doctorId') doctorId?: string,
  ) {
    // Standard price is 14900 INR or 149 USD. If amount is not passed, use 12400 INR as default.
    const finalAmount =
      amount !== undefined && amount !== null ? amount : 12400;
    const order = await this.paymentsService.createOrder(
      finalAmount,
      currency || 'INR',
      doctorId,
    );
    return {
      success: true,
      data: order,
    };
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  async verifyPayment(
    @Body('razorpay_order_id') orderId: string,
    @Body('razorpay_payment_id') paymentId: string,
    @Body('razorpay_signature') signature: string,
    @Body('appointmentDetails') appointmentDetails: any,
    @RequestUser('sub') userId: string,
  ) {
    // 1. Verify Payment
    this.paymentsService.verifyPayment(orderId, paymentId, signature);

    // 2. If valid, create the appointment
    const appointment = await this.appointmentsService.createForUser(
      userId,
      appointmentDetails.doctorId,
      appointmentDetails.appointmentDate,
      appointmentDetails.appointmentTime,
      appointmentDetails.consultationType,
      paymentId,
    );

    // 3. Notify Admins
    await this.notificationsService.notifyAdmins(
      'New Payment Received',
      `Payment received for appointment ${appointment.id}. Plan Price: Paid.`,
      'Audit'
    );

    // 4. Notify Doctor
    if (appointmentDetails.doctorId) {
      const doctor = await this.prisma.doctor.findUnique({
        where: { id: appointmentDetails.doctorId },
      });
      if (doctor && doctor.userId) {
        await this.notificationsService.createAndEmitNotification(
          doctor.userId,
          'Payment Received',
          `A patient has successfully paid ₹${doctor.consultationFee} for a consultation.`,
          'Payment'
        );
      }
    }

    return {
      success: true,
      message: 'Payment verified and appointment booked',
      data: appointment,
    };
  }
}
