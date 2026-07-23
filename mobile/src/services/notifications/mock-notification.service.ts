import { mockAuthService } from '@/services/auth/mock-auth.service';
import { mockNotifications } from '@/mocks/seed-data';
import { clone, delay } from '@/mocks/utils';
import type { NotificationService } from '@/services/notifications/notification.service';
import type { NotificationItem, NotificationType } from '@/types/notification';
import { nowIso } from '@/utils/dates';

let notifications = clone(mockNotifications);

async function getScopedNotifications(): Promise<NotificationItem[]> {
  const session = await mockAuthService.getSession();
  if (!session) {
    return [];
  }
  return notifications
    .filter((item) => item.userId === session.user.id)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function pushMockNotification(input: {
  userId: string;
  workOrderId?: string;
  type: NotificationType;
  title: string;
  body: string;
  deepLink?: string;
}): void {
  notifications = [
    {
      id: `notif-${Date.now()}`,
      tenantId: 'tenant-faberon',
      userId: input.userId,
      workOrderId: input.workOrderId,
      type: input.type,
      title: input.title,
      body: input.body,
      createdAt: nowIso(),
      deepLink: input.deepLink,
    },
    ...notifications,
  ];
}

export class MockNotificationService implements NotificationService {
  async listForCurrentUser(): Promise<NotificationItem[]> {
    await delay();
    return clone(await getScopedNotifications());
  }

  async markAllRead(): Promise<void> {
    await delay(150);
    const session = await mockAuthService.getSession();
    if (!session) {
      return;
    }
    notifications = notifications.map((item) =>
      item.userId === session.user.id
        ? { ...item, readAt: item.readAt ?? nowIso() }
        : item,
    );
  }

  async markAsRead(id: string): Promise<void> {
    await delay(100);
    const session = await mockAuthService.getSession();
    if (!session) {
      return;
    }
    notifications = notifications.map((item) =>
      item.id === id && item.userId === session.user.id
        ? { ...item, readAt: item.readAt ?? nowIso() }
        : item,
    );
  }
}

export const mockNotificationService = new MockNotificationService();
