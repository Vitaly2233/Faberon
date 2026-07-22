import type { NotificationService } from '@/services/notifications/notification.service';

/**
 * The backend does not expose notifications yet. This adapter keeps the UI stable
 * while work-order history and other API data drive the core workflows.
 */
export function createHttpNotificationService(): NotificationService {
  return {
    async listForCurrentUser() {
      return [];
    },

    async markAllRead() {
      return;
    },

    async markAsRead() {
      return;
    },
  };
}
