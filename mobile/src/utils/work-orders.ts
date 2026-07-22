import type { RepairWorkflowStage, WorkOrder } from '@/types/work-order';

export const WORKFLOW_STAGES: RepairWorkflowStage[] = [
  'WAITING',
  'TRAVEL_AND_DIAGNOSIS',
  'WAITING_FOR_PARTS',
  'REPAIRED',
];

export type LegacyRepairWorkflowStage = RepairWorkflowStage | 'CUSTOMER_CONFIRMED';

export function normalizeWorkflowStage(stage: string): RepairWorkflowStage {
  return stage === 'CUSTOMER_CONFIRMED' ? 'REPAIRED' : (stage as RepairWorkflowStage);
}

export type WorkOrderFilter = 'ALL' | 'ACTIVE' | 'COMPLETED';

export function getWorkflowStageIndex(stage: LegacyRepairWorkflowStage): number {
  return WORKFLOW_STAGES.indexOf(normalizeWorkflowStage(stage));
}

export function isActiveWorkOrder(order: WorkOrder): boolean {
  return normalizeWorkflowStage(order.workflowStage) !== 'REPAIRED' && order.status !== 'CANCELLED';
}

export function filterWorkOrders(orders: WorkOrder[], filter: WorkOrderFilter): WorkOrder[] {
  switch (filter) {
    case 'ACTIVE':
      return orders.filter(isActiveWorkOrder);
    case 'COMPLETED':
      return orders.filter(
        (order) =>
          normalizeWorkflowStage(order.workflowStage) === 'REPAIRED' || order.status === 'COMPLETED',
      );
    default:
      return orders;
  }
}

export function getCustomerVisibleTimeline(order: WorkOrder) {
  return [...order.timeline]
    .filter((event) => event.customerVisible)
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));
}

export function getNextWorkflowStage(
  stage: LegacyRepairWorkflowStage,
): RepairWorkflowStage | null {
  const index = getWorkflowStageIndex(stage);
  if (index < 0 || index >= WORKFLOW_STAGES.length - 1) {
    return null;
  }
  return WORKFLOW_STAGES[index + 1] ?? null;
}

export function canTechnicianAdvanceStage(stage: LegacyRepairWorkflowStage): boolean {
  return normalizeWorkflowStage(stage) !== 'REPAIRED';
}

export function getMyAssignedOrders(orders: WorkOrder[], technicianId: string): WorkOrder[] {
  return orders
    .filter((order) => order.assignedTechnicianId === technicianId)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}
