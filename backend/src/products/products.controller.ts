import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Products Module')
@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'List all active products',
    description:
      'Returns a list of all active medicines and wellness products.',
  })
  @ApiResponse({ status: 200, description: 'Products fetched successfully.' })
  async getAllActive() {
    const data = await this.productsService.findAllActive();
    return {
      message: 'Products fetched successfully',
      data,
    };
  }
}
