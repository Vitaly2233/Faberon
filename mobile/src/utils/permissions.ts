import type { UserRole } from '@/constants/roles';
import type { WorkOrder, WorkOrderStatus } from '@/types/work-order';
import { normalizeWorkflowStage } from '@/utils/work-orders';

export function canCustomerEditWorkOrder(workOrder: WorkOrder): boolean {
  return ['DRAFT', 'SUBMITTED'].includes(workOrder.status);
}

export function canViewInternalCosts(role: UserRole): boolean {
  return role === 'OWNER' || role === 'TECHNICIAN';
}

export function canAssignTechnician(role: UserRole): boolean {
  return role === 'OWNER' || role === 'TECHNICIAN';
}

export function isWorkOrderEditableByRole(role: UserRole, workOrder: WorkOrder): boolean {
  if (role === 'CUSTOMER') {
    return canCustomerEditWorkOrder(workOrder);
  }
  if (role === 'TECHNICIAN') {
    return workOrder.status !== 'COMPLETED' && workOrder.status !== 'CANCELLED';
  }
  return role === 'OWNER';
}

export function isTerminalStatus(status: WorkOrderStatus): boolean {
  return status === 'COMPLETED' || status === 'CANCELLED';
}

export function canCustomerViewInvoice(workOrder: WorkOrder): boolean {
  return (
    normalizeWorkflowStage(workOrder.workflowStage) === 'REPAIRED' &&
    workOrder.status !== 'CANCELLED'
  );
}
