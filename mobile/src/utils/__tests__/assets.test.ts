import { countWorkingAssets, filterAssetsByQuery } from '@/utils/assets';
import type { Asset } from '@/types/asset';
import type { WorkOrder } from '@/types/work-order';

const asset: Asset = {
  id: 'asset-1',
  tenantId: 'tenant',
  customerId: 'customer',
  assetType: 'printer',
  manufacturer: 'HP',
  model: 'M607',
  serialNumber: 'SN-1',
  ownershipType: 'CUSTOMER_OWNED',
  status: 'ACTIVE',
  meterReadings: [],
};

const workOrders: WorkOrder[] = [
  {
    id: 'wo-1',
    number: 1,
    tenantId: 'tenant',
    customerId: 'customer',
    customerName: 'Customer',
    address: 'Address',
    contactPersonName: 'Contact',
    problemDescription: 'Problem',
    assetId: 'asset-1',
    creationSource: 'CUSTOMER_REQUEST',
    status: 'IN_PROGRESS',
    workflowStage: 'WAITING_FOR_PARTS',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    timeline: [],
    invoiceDisplayMode: 'ITEMIZED',
  },
];

describe('asset utils', () => {
  it('filters assets by search query', () => {
    expect(filterAssetsByQuery([asset], 'hp')).toHaveLength(1);
    expect(filterAssetsByQuery([asset], 'canon')).toHaveLength(0);
  });

  it('counts working assets without active repairs', () => {
    expect(countWorkingAssets([asset], workOrders)).toBe(0);
    expect(countWorkingAssets([asset], [])).toBe(1);
  });
});
