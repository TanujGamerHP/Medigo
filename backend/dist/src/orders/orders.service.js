"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkout(userId, productId, quantity, shippingAddress) {
        const patient = await this.prisma.patient.findUnique({
            where: { userId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient profile not found.');
        }
        const activeMembership = await this.prisma.membership.findFirst({
            where: {
                patientId: patient.id,
                status: 'Active',
                expiryDate: { gt: new Date() },
            },
        });
        if (!activeMembership) {
            throw new common_1.BadRequestException('Checkout blocked: Membership Required. An active membership program is required to checkout.');
        }
        const approvedConsultation = await this.prisma.consultation.findFirst({
            where: {
                patientId: patient.id,
                treatmentRecommendation: 'Approved for Treatment',
            },
        });
        if (!approvedConsultation) {
            throw new common_1.BadRequestException('Checkout blocked: Doctor Approval Required. Your treatment plan has not been approved by a clinician.');
        }
        const activePrescription = await this.prisma.prescription.findFirst({
            where: {
                patientId: patient.id,
                status: 'Active',
            },
        });
        if (!activePrescription) {
            throw new common_1.BadRequestException('Checkout blocked: Prescription Required. No active prescription was found for your account.');
        }
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product || !product.isActive) {
            throw new common_1.NotFoundException('Product not found or unavailable.');
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
    async getHistory(userId) {
        const patient = await this.prisma.patient.findUnique({
            where: { userId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient profile not found.');
        }
        return this.prisma.order.findMany({
            where: { patientId: patient.id, deletedAt: null },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map