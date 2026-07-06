import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequestUser } from '../common/decorators/user.decorator';

@Controller('api/v1/payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly appointmentsService: AppointmentsService
  ) {}

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body('amount') amount: number, @Body('currency') currency: string) {
    // Standard price is 14900 INR or 149 USD. If amount is not passed, use 12400 INR as default.
    const finalAmount = amount !== undefined && amount !== null ? amount : 12400;
    const order = await this.paymentsService.createOrder(finalAmount, currency || 'INR'); 
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
      appointmentDetails.consultationType
    );

    return {
      success: true,
      message: 'Payment verified and appointment booked',
      data: appointment,
    };
  }
}
