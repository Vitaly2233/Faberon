import { createApiError } from '@/services/api/errors';
import { mockAuthService } from '@/services/auth/mock-auth.service';
import { mockAssets } from '@/mocks/seed-data';
import { clone, delay } from '@/mocks/utils';
import type { CreateAssetFormValues } from '@/schemas/asset.schema';
import type { AssetService } from '@/services/assets/asset.service';
import type { Asset } from '@/types/asset';
import { todayIsoDate } from '@/utils/dates';

let assets = clone(mockAssets);
let nextAssetNumber = assets.length + 1;

async function getScopedAssets(): Promise<Asset[]> {
  const session = await mockAuthService.getSession();
  if (!session?.user.customerId) {
    return assets;
  }
  return assets.filter((asset) => asset.customerId === session.user.customerId);
}

export class MockAssetService implements AssetService {
  async listForCurrentUser(): Promise<Asset[]> {
    await delay();
    return clone(await getScopedAssets());
  }

  async getById(id: string) {
    await delay();
    const scoped = await getScopedAssets();
    const asset = scoped.find((item) => item.id === id);
    if (!asset) {
      throw createApiError('ASSET_NOT_FOUND', 'Asset does not exist');
    }
    return clone(asset);
  }

  async create(input: CreateAssetFormValues): Promise<Asset> {
    await delay();
    const session = await mockAuthService.getSession();
    if (!session?.user.customerId) {
      throw createApiError('FORBIDDEN', 'Only customers can create assets');
    }

    const created: Asset = {
      id: `asset-p${nextAssetNumber}`,
      tenantId: 'tenant-faberon',
      customerId: session.user.customerId,
      assetType: input.assetType,
      manufacturer: input.manufacturer,
      model: input.model,
      serialNumber: input.serialNumber ?? `SN-NEW-${nextAssetNumber}`,
      ownershipType: input.ownershipType,
      assignedToCustomerDate: todayIsoDate(),
      address: input.address,
      primaryContactName: input.primaryContactName,
      description: input.description,
      status: 'ACTIVE',
      meterReadings: [],
    };

    nextAssetNumber += 1;
    assets = [created, ...assets];
    return clone(created);
  }
}

export const mockAssetService = new MockAssetService();
