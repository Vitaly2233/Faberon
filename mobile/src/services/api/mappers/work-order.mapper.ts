import {
  mapBackendStageToWorkflow,
  mapWorkflowStageToBackend,
} from '@/services/api/mappers/stage.mapper';
import type {
  BackendContactResponse,
  BackendCustomerResponse,
  BackendWorkOrderHistoryItem,
  BackendWorkOrderResponse,
} from '@/services/api/backend-types';
import type { AuthUser } from '@/types/auth';
import type {
  RepairWorkflowStage,
  TimelineEvent,
  WorkOrder,
  WorkOrderStatus,
} from '@/types/work-order';

interface WorkOrderMapContext {
  customerName?: string;
  address?: string;
  contactPersonName?: string;
  contactPhone?: string;
  contactEmail?: string;
  history?: BackendWorkOrderHistoryItem[];
  sessionUser?: AuthUser | null;
}

function deriveStatus(stage: RepairWorkflowStage, workerId: string | null): WorkOrderStatus {
  if (stage === 'REPAIRED') {
    return 'COMPLETED';
  }
  if (workerId) {
    return 'IN_PROGRESS';
  }
  return 'SUBMITTED';
}

function mapHistoryToTimeline(
  history: BackendWorkOrderHistoryItem[],
  sessionUser?: AuthUser | null,
): TimelineEvent[] {
  return history.map((item) => ({
    id: item.id,
    type: 'COMMENT_ADDED',
    title: 'Update',
    description: item.text,
    authorId: item.workerId ?? sessionUser?.id ?? 'system',
    authorName: sessionUser?.displayName ?? 'System',
    occurredAt: item.createdAt,
    customerVisible: true,
  }));
}

export function mapWorkOrderFromBackend(
  order: BackendWorkOrderResponse,
  context: WorkOrderMapContext = {},
): WorkOrder {
  const workflowStage = mapBackendStageToWorkflow(order.stage);
  const createdAt =
    typeof order.createdAt === 'string' ? order.createdAt : new Date(order.createdAt).toISOString();

  return {
    id: order.id,
    number: order.number,
    tenantId: order.companyId,
    customerId: order.customerId,
    customerName: context.customerName ?? 'Customer',
    address: context.address ?? '',
    contactPersonName: context.contactPersonName ?? context.customerName ?? 'Contact',
    contactPhone: context.contactPhone,
    contactEmail: context.contactEmail,
    problemDescription: order.description,
    assetId: order.productId ?? undefined,
    creationSource: 'CUSTOMER_REQUEST',
    status: deriveStatus(workflowStage, order.workerId),
    workflowStage,
    assignedTechnicianId: order.workerId ?? undefined,
    assignedTechnicianName: order.workerId ? context.sessionUser?.displayName : undefined,
    estimatedCompletionDate: order.estimatedDate ?? undefined,
    createdAt,
    updatedAt: createdAt,
    timeline: mapHistoryToTimeline(context.history ?? [], context.sessionUser),
    invoiceDisplayMode: order.showFinalPrice ? 'TOTAL_ONLY' : 'ITEMIZED',
  };
}

export function mapCustomerToWorkOrderContext(
  customer: BackendCustomerResponse,
  contact?: BackendContactResponse | null,
): Pick<
  WorkOrderMapContext,
  'customerName' | 'address' | 'contactPersonName' | 'contactPhone' | 'contactEmail'
> {
  return {
    customerName: customer.name,
    address: customer.address ?? customer.city ?? '',
    contactPersonName: contact?.name ?? customer.name,
    contactPhone: contact?.phone ?? undefined,
    contactEmail: contact?.email ?? undefined,
  };
}

export function mapWorkflowStageToBackendStage(stage: RepairWorkflowStage) {
  return mapWorkflowStageToBackend(stage);
}
