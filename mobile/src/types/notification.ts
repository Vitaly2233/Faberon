export type NotificationType =
  | 'WORK_ORDER_ACCEPTED'
  | 'TECHNICIAN_ASSIGNED'
  | 'STAGE_CHANGED'
  | 'ESTIMATE_ADDED'
  | 'ESTIMATE_CHANGED'
  | 'COMMENT_ADDED'
  | 'REPAIR_COMPLETED';

export interface NotificationItem {
  id: string;
  tenantId: string;
  userId: string;
  workOrderId?: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  readAt?: string;
  deepLink?: string;
}
