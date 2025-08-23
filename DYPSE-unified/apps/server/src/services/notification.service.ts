import { PrismaClient, type Notification, type NotificationTarget, type UserRole } from '@prisma/client';
import { prisma } from '../config/db';

export interface CreateNotificationInput {
  title: string;
  message: string;
  target: NotificationTarget;
  scheduledAt?: Date | null;
}

export interface NotificationWithReadStatus extends Notification {
  read?: boolean;
  readAt?: Date | null;
}

class NotificationService {
  constructor(private prisma: PrismaClient) {}

  async createNotification(data: CreateNotificationInput): Promise<Notification> {
    const notification = await this.prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        target: data.target,
        scheduledAt: data.scheduledAt ?? null,
        status: data.scheduledAt ? 'scheduled' : 'sent',
        sentAt: !data.scheduledAt || data.scheduledAt <= new Date() ? new Date() : null,
      },
    });

    // If notification is to be sent immediately, create user notifications
    if (!data.scheduledAt || data.scheduledAt <= new Date()) {
      await this.distributeNotification(notification.id, data.target);
    }

    return notification;
  }

  private async distributeNotification(notificationId: string, target: NotificationTarget): Promise<void> {
    // Get all users who should receive this notification
    const where: any = {};
    if (target !== 'ALL') {
      where.role = target === 'YOUTHS' ? 'youth' as UserRole : 'employer' as UserRole;
    }

    const users = await this.prisma.user.findMany({
      where,
      select: { id: true },
    });

    // Create user notification records
    await this.prisma.userNotification.createMany({
      data: users.map(user => ({
        userId: user.id,
        notificationId,
        isRead: false,
      })),
      skipDuplicates: true,
    });

    // Update notification status
    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { status: 'sent', sentAt: new Date() },
    });
  }

  async getUserNotifications(userId: string, limit = 20, cursor?: string): Promise<{
    notifications: NotificationWithReadStatus[];
    nextCursor?: string;
  }> {
    const take = Math.min(limit, 50);
    
    const userNotifications = await this.prisma.userNotification.findMany({
      where: { userId },
      include: {
        notification: true,
      },
      orderBy: { notification: { createdAt: 'desc' } },
      take: take + 1, // Get one extra to determine if there are more
      cursor: cursor ? { id: cursor } : undefined,
    });

    let nextCursor: string | undefined;
    if (userNotifications.length > take) {
      const nextItem = userNotifications.pop();
      nextCursor = nextItem?.id;
    }

    const notifications = userNotifications.map((un) => ({
      ...un.notification,
      read: un.isRead,
      readAt: un.readAt,
    }));

    return { notifications, nextCursor };
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    await this.prisma.userNotification.updateMany({
      where: {
        userId,
        notificationId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.userNotification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.userNotification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }
}

export const notificationService = new NotificationService(prisma);
