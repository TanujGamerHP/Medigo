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

  async notifyAdmins(title: string, message: string, type: string) {
    const admins = await this.prisma.user.findMany({
      where: { role: 'Admin' },
    });

    for (const admin of admins) {
      await this.createAndEmitNotification(admin.id, title, message, type);
    }
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

  async delete(id: string, userId: string) {
    const notif = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notif) {
      // If it's already deleted, just return successfully to keep UI in sync
      return { success: true };
    }

    if (notif.userId !== userId) {
      throw new NotFoundException('Notification alert not found');
    }

    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
