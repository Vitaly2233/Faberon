import { canCustomerEditWorkOrder, canCustomerViewInvoice } from '@/utils/permissions';
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
  status: 'SUBMITTED',
  workflowStage: 'WAITING',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  timeline: [],
  invoiceDisplayMode: 'ITEMIZED',
};

describe('canCustomerEditWorkOrder', () => {
  it('allows edits before acceptance', () => {
    expect(canCustomerEditWorkOrder(baseOrder)).toBe(true);
  });

  it('blocks edits after acceptance', () => {
    expect(canCustomerEditWorkOrder({ ...baseOrder, status: 'ACCEPTED' })).toBe(false);
  });
});

describe('canCustomerViewInvoice', () => {
  it('allows invoice preview after repair is complete', () => {
    expect(canCustomerViewInvoice({ ...baseOrder, workflowStage: 'REPAIRED' })).toBe(true);
    expect(canCustomerViewInvoice({ ...baseOrder, workflowStage: 'WAITING_FOR_PARTS' })).toBe(false);
  });
});
