import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublic(rating?: number) {
    if (rating) {
      return this.prisma.review.findMany({
        where: { rating },
        orderBy: { createdAt: 'desc' },
      });
    }
    // Default home page query: 5 stars, selected for home
    return this.prisma.review.findMany({
      where: {
        rating: 5,
        isSelectedForHome: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any) {
    return this.prisma.review.create({
      data: {
        patientName: data.patientName,
        age: parseInt(data.age, 10),
        profileImage: data.profileImage,
        beforeImage: data.beforeImage,
        afterImage: data.afterImage,
        weightLossKg: parseFloat(data.weightLossKg),
        durationMonths: parseInt(data.durationMonths, 10),
        reviewText: data.reviewText,
        rating: parseInt(data.rating, 10),
        isSelectedForHome: data.isSelectedForHome === true || data.isSelectedForHome === 'true',
      },
    });
  }

  async update(id: string, data: any) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    const updateData: any = {};
    if (data.patientName !== undefined) updateData.patientName = data.patientName;
    if (data.age !== undefined) updateData.age = parseInt(data.age, 10);
    if (data.profileImage !== undefined) updateData.profileImage = data.profileImage;
    if (data.beforeImage !== undefined) updateData.beforeImage = data.beforeImage;
    if (data.afterImage !== undefined) updateData.afterImage = data.afterImage;
    if (data.weightLossKg !== undefined) updateData.weightLossKg = parseFloat(data.weightLossKg);
    if (data.durationMonths !== undefined) updateData.durationMonths = parseInt(data.durationMonths, 10);
    if (data.reviewText !== undefined) updateData.reviewText = data.reviewText;
    if (data.rating !== undefined) updateData.rating = parseInt(data.rating, 10);
    if (data.isSelectedForHome !== undefined) updateData.isSelectedForHome = data.isSelectedForHome === true || data.isSelectedForHome === 'true';

    return this.prisma.review.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.review.delete({
      where: { id },
    });
  }
}
