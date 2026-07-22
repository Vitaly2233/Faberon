import type { BackendProductResponse } from '@/services/api/backend-types';
import type { Asset, AssetOwnershipType } from '@/types/asset';

function mapOwnership(ownership: BackendProductResponse['ownership']): AssetOwnershipType {
  if (ownership === 'rented') {
    return 'LEASED';
  }
  return 'CUSTOMER_OWNED';
}

export function mapProductToAsset(product: BackendProductResponse, typeName?: string): Asset {
  return {
    id: product.id,
    tenantId: product.companyId,
    customerId: product.customerId,
    assetType: typeName ?? 'Printer',
    manufacturer: product.manufacturer,
    model: product.model,
    serialNumber: product.serialNumber,
    ownershipType: mapOwnership(product.ownership),
    warrantyEndDate: product.warrantyDate ?? undefined,
    address: product.address ?? undefined,
    primaryContactName: product.contactName ?? undefined,
    status: 'ACTIVE',
    meterReadings: [],
  };
}

export function mapAssetOwnershipToBackend(
  ownershipType: AssetOwnershipType,
): BackendProductResponse['ownership'] {
  if (ownershipType === 'LEASED') {
    return 'rented';
  }
  return 'by_client';
}
