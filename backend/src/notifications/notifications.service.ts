import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private realtimeService: RealtimeService,
  ) {}

  async createAndEmitNotification(userId: string, title: string, message: string, type: string) {
    const notif = await this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });

    this.realtimeService.emit('notification.new', {
      targetUserId: userId,
      notification: notif,
    });

    return notif;
  }

  async findForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, userId: string) {
    const notif = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notif || notif.userId !== userId) {
      throw new NotFoundException('Notification alert not found');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
