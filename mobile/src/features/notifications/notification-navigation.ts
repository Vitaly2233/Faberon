import { router } from 'expo-router';

import { routes } from '@/constants/routes';
import type { NotificationItem } from '@/types/notification';

export function openNotificationTarget(item: NotificationItem): void {
  if (!item.workOrderId) {
    return;
  }

  router.push(routes.customer.workOrderDetail(item.workOrderId));
}
