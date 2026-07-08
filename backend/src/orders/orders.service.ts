import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async checkout(
    userId: string,
    items: { productId: string; quantity: number }[],
    shippingAddress: string,
    paymentMethod: string,
    orderId?: string,
    paymentId?: string,
    signature?: string,
  ) {
    // Verify Razorpay signature if online payment
    if (paymentMethod === 'Razorpay') {
      if (!orderId || !paymentId || !signature) {
        throw new BadRequestException('Missing Razorpay payment details');
      }

      const secret =
        this.configService.get<string>('RAZORPAY_KEY_SECRET') || 'dummy';
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(orderId + '|' + paymentId)
        .digest('hex');

      if (generatedSignature !== signature) {
        throw new BadRequestException('Invalid payment signature');
      }
    }

    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found.');
    }

    // SECURITY GATES:
    // 1. Check active membership
    const activeMembership = await this.prisma.membership.findFirst({
      where: {
        patientId: patient.id,
        status: 'Active',
        expiryDate: { gt: new Date() },
      },
    });

    if (!activeMembership) {
      throw new BadRequestException(
        'Checkout blocked: Membership Required. An active membership program is required to checkout.',
      );
    }

    // 2. Check treatment recommendation approval in consultation
    // (Removed as per new requirements allowing direct purchase with membership)
    // const approvedConsultation = await this.prisma.consultation.findFirst({
    //   where: {
    //     patientId: patient.id,
    //     treatmentRecommendation: 'Approved for Treatment',
    //   },
    // });
    // if (!approvedConsultation) {
    //   throw new BadRequestException('Checkout blocked: Doctor Approval Required. Your treatment plan has not been approved by a clinician.');
    // }

    // 3. Check active prescription
    // (Removed as per new requirements allowing direct purchase with membership)
    // const activePrescription = await this.prisma.prescription.findFirst({
    //   where: {
    //     patientId: patient.id,
    //     status: 'Active',
    //   },
    // });
    // if (!activePrescription) {
    //   throw new BadRequestException('Checkout blocked: Prescription Required. No active prescription was found for your account.');
    // }

    if (!items || items.length === 0) {
      throw new BadRequestException('Cart is empty.');
    }

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.isActive) {
        throw new NotFoundException(
          `Product ${item.productId} not found or unavailable.`,
        );
      }

      totalAmount += product.price * item.quantity;
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    return this.prisma.order.create({
      data: {
        patientId: patient.id,
        totalAmount,
        status: paymentMethod === 'COD' ? 'Pending' : 'Paid',
        paymentMethod: paymentMethod,
        paymentId: paymentId || null,
        shippingAddress,
        createdBy: userId,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });
  }

  async checkEligibility(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found.');
    }

    const activeMembership = await this.prisma.membership.findFirst({
      where: {
        patientId: patient.id,
        status: 'Active',
        expiryDate: { gt: new Date() },
      },
    });

    if (!activeMembership) {
      return { eligible: false, message: 'Membership Required' };
    }

    return { eligible: true, message: 'Eligible for purchase' };
  }

  async getHistory(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found.');
    }

    return this.prisma.order.findMany({
      where: { patientId: patient.id, deletedAt: null },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      where: { deletedAt: null },
      include: {
        items: { include: { product: true } },
        patient: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
