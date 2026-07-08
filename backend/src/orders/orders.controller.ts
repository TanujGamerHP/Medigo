import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RequestUser } from '../common/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Orders Module')
@Controller('api/v1/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Patient)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Checkout a cart', description: 'Creates an order for medications if prescription gate allows.' })
  @ApiResponse({ status: 201, description: 'Order created.' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['items', 'shippingAddress', 'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'],
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productId: { type: 'string' },
              quantity: { type: 'number' },
            }
          }
        },
        shippingAddress: { type: 'string' },
        paymentMethod: { type: 'string', enum: ['COD', 'Razorpay'] },
        razorpay_order_id: { type: 'string' },
        razorpay_payment_id: { type: 'string' },
        razorpay_signature: { type: 'string' },
      }
    }
  })
  async checkout(
    @RequestUser('sub') userId: string,
    @Body('items') items: { productId: string; quantity: number }[],
    @Body('shippingAddress') shippingAddress: string,
    @Body('paymentMethod') paymentMethod: string,
    @Body('razorpay_order_id') orderId?: string,
    @Body('razorpay_payment_id') paymentId?: string,
    @Body('razorpay_signature') signature?: string,
  ) {
    const data = await this.ordersService.checkout(userId, items, shippingAddress, paymentMethod, orderId, paymentId, signature);
    return {
      message: 'Order processed successfully',
      data,
    };
  }

  @Get('check-eligibility')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Patient)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check store eligibility', description: 'Checks if patient has required membership to buy medicines.' })
  @ApiResponse({ status: 200, description: 'Eligibility returned.' })
  async checkEligibility(@RequestUser('sub') userId: string) {
    const data = await this.ordersService.checkEligibility(userId);
    return {
      message: 'Eligibility checked successfully',
      data,
    };
  }

  @Get('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Patient)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order history', description: 'Retrieves all past orders of the patient.' })
  @ApiResponse({ status: 200, description: 'Order logs returned.' })
  async getHistory(@RequestUser('sub') userId: string) {
    const data = await this.ordersService.getHistory(userId);
    return {
      message: 'Order logs retrieved successfully',
      data,
    };
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders', description: 'Retrieves all orders for admin dashboard.' })
  @ApiResponse({ status: 200, description: 'Order logs returned.' })
  async getAllOrders() {
    const data = await this.ordersService.getAllOrders();
    return {
      message: 'Orders retrieved successfully',
      data,
    };
  }
}
