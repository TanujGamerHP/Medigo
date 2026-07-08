import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(private configService: ConfigService) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID') || 'dummy',
      key_secret:
        this.configService.get<string>('RAZORPAY_KEY_SECRET') || 'dummy',
    });
  }

  async createOrder(amount: number, currency: string = 'INR') {
    try {
      const options = {
        amount: amount * 100, // amount in the smallest currency unit (paise for INR)
        currency,
        receipt: `receipt_order_${Date.now()}`,
      };
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
