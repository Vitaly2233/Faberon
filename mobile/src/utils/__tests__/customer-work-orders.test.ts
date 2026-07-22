import type { WorkOrder } from '@/types/work-order';
import {
  getCustomerHomeRepairPriority,
  getRepairContextLabel,
  sortOrdersForCustomerHome,
} from '@/utils/customer-work-orders';

const baseOrder: WorkOrder = {
  id: 'wo-1',
  number: 1042,
  tenantId: 'tenant-faberon',
  customerId: 'customer-c1',
  customerName: 'Grand Hotel',
  address: 'Front desk',
  contactPersonName: 'John Doe',
  problemDescription: 'Paper jams repeatedly',
  creationSource: 'CUSTOMER_REQUEST',
  status: 'IN_PROGRESS',
  workflowStage: 'WAITING_FOR_PARTS',
  createdAt: '2026-07-10T10:00:00.000Z',
  updatedAt: '2026-07-16T15:30:00.000Z',
  timeline: [],
  invoiceDisplayMode: 'ITEMIZED',
};

describe('sortOrdersForCustomerHome', () => {
  it('prioritizes draft and submitted requests', () => {
    const sorted = sortOrdersForCustomerHome([
      { ...baseOrder, id: 'wo-a', status: 'IN_PROGRESS', updatedAt: '2026-07-18T00:00:00.000Z' },
      { ...baseOrder, id: 'wo-b', status: 'SUBMITTED', updatedAt: '2026-07-10T00:00:00.000Z' },
    ]);

    expect(sorted[0]?.id).toBe('wo-b');
  });

  it('sorts by updated date within the same priority', () => {
    const sorted = sortOrdersForCustomerHome([
      { ...baseOrder, id: 'wo-old', updatedAt: '2026-07-10T00:00:00.000Z' },
      { ...baseOrder, id: 'wo-new', updatedAt: '2026-07-18T00:00:00.000Z' },
    ]);

    expect(sorted[0]?.id).toBe('wo-new');
  });

  it('excludes completed repairs', () => {
    const sorted = sortOrdersForCustomerHome([
      { ...baseOrder, id: 'wo-done', workflowStage: 'REPAIRED', status: 'COMPLETED' },
      { ...baseOrder, id: 'wo-active', workflowStage: 'WAITING_FOR_PARTS' },
    ]);

    expect(sorted).toHaveLength(1);
    expect(sorted[0]?.id).toBe('wo-active');
  });
});

describe('getRepairContextLabel', () => {
  it('combines location and problem when available', () => {
    expect(
      getRepairContextLabel(baseOrder, {
        id: 'asset-1',
        tenantId: 'tenant-faberon',
        customerId: 'customer-c1',
        assetType: 'PRINTER',
        manufacturer: 'HP',
        model: 'LaserJet',
        serialNumber: 'SN-1',
        ownershipType: 'CUSTOMER_OWNED',
        status: 'ACTIVE',
        meterReadings: [],
        primaryContactName: 'Front desk',
      }),
    ).toBe('Front desk · Paper jams repeatedly');
  });

  it('falls back to problem only', () => {
    expect(getRepairContextLabel({ ...baseOrder, address: '' })).toBe('Paper jams repeatedly');
  });
});

describe('getCustomerHomeRepairPriority', () => {
  it('returns lowest value for draft and submitted orders', () => {
    expect(getCustomerHomeRepairPriority({ ...baseOrder, status: 'SUBMITTED' })).toBe(0);
    expect(getCustomerHomeRepairPriority({ ...baseOrder, status: 'IN_PROGRESS' })).toBe(1);
  });
});
