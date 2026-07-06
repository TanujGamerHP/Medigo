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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const appointments_service_1 = require("../appointments/appointments.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const user_decorator_1 = require("../common/decorators/user.decorator");
let PaymentsController = class PaymentsController {
    paymentsService;
    appointmentsService;
    constructor(paymentsService, appointmentsService) {
        this.paymentsService = paymentsService;
        this.appointmentsService = appointmentsService;
    }
    async createOrder(amount, currency) {
        const finalAmount = amount !== undefined && amount !== null ? amount : 12400;
        const order = await this.paymentsService.createOrder(finalAmount, currency || 'INR');
        return {
            success: true,
            data: order,
        };
    }
    async verifyPayment(orderId, paymentId, signature, appointmentDetails, userId) {
        this.paymentsService.verifyPayment(orderId, paymentId, signature);
        const appointment = await this.appointmentsService.createForUser(userId, appointmentDetails.doctorId, appointmentDetails.appointmentDate, appointmentDetails.appointmentTime, appointmentDetails.consultationType);
        return {
            success: true,
            message: 'Payment verified and appointment booked',
            data: appointment,
        };
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('create-order'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('amount')),
    __param(1, (0, common_1.Body)('currency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Post)('verify'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('razorpay_order_id')),
    __param(1, (0, common_1.Body)('razorpay_payment_id')),
    __param(2, (0, common_1.Body)('razorpay_signature')),
    __param(3, (0, common_1.Body)('appointmentDetails')),
    __param(4, (0, user_decorator_1.RequestUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "verifyPayment", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('api/v1/payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        appointments_service_1.AppointmentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map