import type { Asset, MeterReading } from '@/types/asset';
import type { WorkOrder } from '@/types/work-order';
import { isActiveWorkOrder } from '@/utils/work-orders';

export function getAssetDisplayName(asset: Asset): string {
  return `${asset.manufacturer} ${asset.model}`;
}

export function formatOwnershipType(ownershipType: Asset['ownershipType']): string {
  switch (ownershipType) {
    case 'CUSTOMER_OWNED':
      return 'Customer owned';
    case 'LEASED':
      return 'Leased';
    case 'SERVICE_COMPANY_OWNED':
      return 'Service company owned';
    default:
      return ownershipType;
  }
}

export function getLatestMeterReading(
  asset: Asset,
  type: MeterReading['type'] = 'BLACK_AND_WHITE',
): MeterReading | undefined {
  return [...asset.meterReadings]
    .filter((reading) => reading.type === type)
    .sort((left, right) => right.recordedAt.localeCompare(left.recordedAt))[0];
}

export function filterAssetsByQuery(assets: Asset[], query: string): Asset[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return assets;
  }

  return assets.filter((asset) => {
    const haystack = [
      asset.manufacturer,
      asset.model,
      asset.serialNumber,
      asset.assetType,
      asset.primaryContactName,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export function getActiveWorkOrderForAsset(
  workOrders: WorkOrder[],
  assetId: string,
): WorkOrder | undefined {
  return workOrders.find((order) => order.assetId === assetId && isActiveWorkOrder(order));
}

export function countWorkingAssets(assets: Asset[], workOrders: WorkOrder[]): number {
  return assets.filter((asset) => !getActiveWorkOrderForAsset(workOrders, asset.id)).length;
}

export function getWorkOrdersForAsset(workOrders: WorkOrder[], assetId: string): WorkOrder[] {
  return workOrders
    .filter((order) => order.assetId === assetId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}
