import type { NotificationType } from '@/types/notification';
import type { ComponentProps } from 'react';
import type { Feather } from '@expo/vector-icons';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

export function getNotificationIcon(type: NotificationType): FeatherIconName {
  switch (type) {
    case 'TECHNICIAN_ASSIGNED':
      return 'user-check';
    case 'STAGE_CHANGED':
      return 'activity';
    case 'ESTIMATE_ADDED':
    case 'ESTIMATE_CHANGED':
      return 'calendar';
    case 'COMMENT_ADDED':
      return 'message-circle';
    case 'REPAIR_COMPLETED':
      return 'check-circle';
    case 'WORK_ORDER_ACCEPTED':
    default:
      return 'bell';
  }
}
