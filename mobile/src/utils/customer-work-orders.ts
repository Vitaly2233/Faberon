import type { Asset } from '@/types/asset';
import type { WorkOrder } from '@/types/work-order';
import { isActiveWorkOrder } from '@/utils/work-orders';

export const CUSTOMER_HOME_REPAIR_LIMIT = 2;

export function getCustomerHomeRepairPriority(order: WorkOrder): number {
  if (['DRAFT', 'SUBMITTED'].includes(order.status)) {
    return 0;
  }
  return 1;
}

export function sortOrdersForCustomerHome(orders: WorkOrder[]): WorkOrder[] {
  return [...orders]
    .filter(isActiveWorkOrder)
    .sort((left, right) => {
      const priorityDiff = getCustomerHomeRepairPriority(left) - getCustomerHomeRepairPriority(right);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      return right.updatedAt.localeCompare(left.updatedAt);
    });
}

export function getRepairLocationLabel(order: WorkOrder, asset?: Asset): string | undefined {
  const fromAsset = asset?.primaryContactName?.trim() || asset?.address?.trim();
  const fromOrder = order.address?.trim();
  return fromAsset || fromOrder || undefined;
}

export function getRepairContextLabel(order: WorkOrder, asset?: Asset): string {
  const location = getRepairLocationLabel(order, asset);
  const problem = order.problemDescription.trim();

  if (location) {
    return `${location} · ${problem}`;
  }

  return problem;
}
