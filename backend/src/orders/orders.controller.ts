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
  @ApiOperation({ summary: 'Checkout a product', description: 'Creates an order for a medication if prescription gate allows.' })
  @ApiResponse({ status: 201, description: 'Order created.' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['productId', 'quantity', 'shippingAddress'],
      properties: {
        productId: { type: 'string' },
        quantity: { type: 'number' },
        shippingAddress: { type: 'string' },
      }
    }
  })
  async checkout(
    @RequestUser('sub') userId: string,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
    @Body('shippingAddress') shippingAddress: string,
  ) {
    const data = await this.ordersService.checkout(userId, productId, quantity, shippingAddress);
    return {
      message: 'Order processed successfully',
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
}
