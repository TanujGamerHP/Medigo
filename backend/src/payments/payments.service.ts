import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID') || 'dummy',
      key_secret:
        this.configService.get<string>('RAZORPAY_KEY_SECRET') || 'dummy',
    });
  }

  async createOrder(amount: number, currency: string = 'INR', doctorId?: string) {
    try {
      const options: any = {
        amount: amount * 100, // amount in the smallest currency unit (paise for INR)
        currency,
        receipt: `receipt_order_${Date.now()}`,
      };

      if (doctorId) {
        const doctor = await this.prisma.doctor.findUnique({
          where: { id: doctorId },
        });

        if (doctor && doctor.razorpayAccountId) {
          // Route the entire fee (100%) to the doctor's connected account
          options.transfers = [
            {
              account: doctor.razorpayAccountId,
              amount: amount * 100,
              currency,
              notes: {
                purpose: "Consultation Fee",
              },
              on_hold: 0,
            }
          ];
        }
      }

      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create Razorpay order');
    }
  }

  verifyPayment(orderId: string, paymentId: string, signature: string) {
    const secret =
      this.configService.get<string>('RAZORPAY_KEY_SECRET') || 'dummy';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    if (generatedSignature !== signature) {
      throw new BadRequestException('Invalid payment signature');
    }

    return true;
  }
}
