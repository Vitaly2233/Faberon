import type { NotificationItem } from '@/types/notification';

export interface NotificationService {
  listForCurrentUser(): Promise<NotificationItem[]>;
  markAllRead(): Promise<void>;
  markAsRead(id: string): Promise<void>;
}
