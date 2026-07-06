import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAllActive() {
    return this.prisma.product.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async getById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }
}
