import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: string, productId: string, quantity: number, shippingAddress: string) {
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
      throw new BadRequestException('Checkout blocked: Membership Required. An active membership program is required to checkout.');
    }

    // 2. Check treatment recommendation approval in consultation
    const approvedConsultation = await this.prisma.consultation.findFirst({
      where: {
        patientId: patient.id,
        treatmentRecommendation: 'Approved for Treatment',
      },
    });

    if (!approvedConsultation) {
      throw new BadRequestException('Checkout blocked: Doctor Approval Required. Your treatment plan has not been approved by a clinician.');
    }

    // 3. Check active prescription
    const activePrescription = await this.prisma.prescription.findFirst({
      where: {
        patientId: patient.id,
        status: 'Active',
      },
    });

    if (!activePrescription) {
      throw new BadRequestException('Checkout blocked: Prescription Required. No active prescription was found for your account.');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found or unavailable.');
    }

    const totalAmount = product.price * quantity;

    return this.prisma.order.create({
      data: {
        patientId: patient.id,
        totalAmount,
        status: 'Paid',
        shippingAddress,
        createdBy: userId,
        items: {
          create: [
            {
              productId,
              quantity,
              price: product.price,
            }
          ]
        }
      },
      include: {
        items: true
      }
    });
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
}
