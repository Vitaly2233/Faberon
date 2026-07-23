export type WorkOrderStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type RepairWorkflowStage =
  | 'WAITING'
  | 'TRAVEL_AND_DIAGNOSIS'
  | 'WAITING_FOR_PARTS'
  | 'REPAIRED';

export type WorkOrderCreationSource =
  | 'CUSTOMER_REQUEST'
  | 'TECHNICIAN_CREATED'
  | 'OWNER_CREATED';

export type TimelineEventType =
  | 'WORK_ORDER_CREATED'
  | 'WORK_ORDER_UPDATED'
  | 'WORK_ORDER_ACCEPTED'
  | 'TECHNICIAN_ASSIGNED'
  | 'STAGE_CHANGED'
  | 'ESTIMATE_ADDED'
  | 'ESTIMATE_CHANGED'
  | 'COMMENT_ADDED'
  | 'REPAIR_COMPLETED'
  | 'CUSTOMER_CONFIRMED'
  | 'PRICE_CHANGED'
  | 'DOCUMENT_GENERATED';

export type CommentVisibility = 'CUSTOMER_VISIBLE' | 'INTERNAL';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  occurredAt: string;
  customerVisible: boolean;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface WorkOrder {
  id: string;
  number: number;
  tenantId: string;
  customerId: string;
  customerName: string;
  address: string;
  contactPersonId?: string;
  contactPersonName: string;
  contactPhone?: string;
  contactEmail?: string;
  problemDescription: string;
  assetId?: string;
  creationSource: WorkOrderCreationSource;
  status: WorkOrderStatus;
  workflowStage: RepairWorkflowStage;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  estimatedCompletionDate?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
  invoiceDisplayMode: 'ITEMIZED' | 'TOTAL_ONLY';
}
