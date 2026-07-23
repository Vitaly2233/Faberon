import { filterWorkOrders, isActiveWorkOrder, getNextWorkflowStage, canTechnicianAdvanceStage, normalizeWorkflowStage } from '@/utils/work-orders';
import type { WorkOrder } from '@/types/work-order';

const baseOrder: WorkOrder = {
  id: 'wo-1',
  number: 1,
  tenantId: 'tenant',
  customerId: 'customer',
  customerName: 'Customer',
  address: 'Address',
  contactPersonName: 'Contact',
  problemDescription: 'Problem',
  creationSource: 'CUSTOMER_REQUEST',
  status: 'IN_PROGRESS',
  workflowStage: 'WAITING_FOR_PARTS',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  timeline: [],
  invoiceDisplayMode: 'ITEMIZED',
};

describe('work order utils', () => {
  it('detects active work orders', () => {
    expect(isActiveWorkOrder(baseOrder)).toBe(true);
    expect(isActiveWorkOrder({ ...baseOrder, workflowStage: 'REPAIRED', status: 'COMPLETED' })).toBe(
      false,
    );
  });

  it('filters active and completed lists', () => {
    const orders: WorkOrder[] = [
      baseOrder,
      { ...baseOrder, id: 'wo-2', workflowStage: 'REPAIRED', status: 'COMPLETED' },
    ];

    expect(filterWorkOrders(orders, 'ACTIVE')).toHaveLength(1);
    expect(filterWorkOrders(orders, 'COMPLETED')).toHaveLength(1);
    expect(filterWorkOrders(orders, 'ALL')).toHaveLength(2);
  });

  it('returns next workflow stage for technician actions', () => {
    expect(getNextWorkflowStage('WAITING')).toBe('TRAVEL_AND_DIAGNOSIS');
    expect(getNextWorkflowStage('REPAIRED')).toBeNull();
  });

  it('blocks technician from advancing completed stages', () => {
    expect(canTechnicianAdvanceStage('WAITING_FOR_PARTS')).toBe(true);
    expect(canTechnicianAdvanceStage('REPAIRED')).toBe(false);
    expect(canTechnicianAdvanceStage('CUSTOMER_CONFIRMED')).toBe(false);
  });

  it('maps legacy customer confirmed stage to repaired', () => {
    expect(normalizeWorkflowStage('CUSTOMER_CONFIRMED')).toBe('REPAIRED');
    expect(isActiveWorkOrder({ ...baseOrder, workflowStage: 'CUSTOMER_CONFIRMED' as never })).toBe(
      false,
    );
  });
});
