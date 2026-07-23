import type { Asset } from '@/types/asset';
import type { CreateAssetFormValues } from '@/schemas/asset.schema';

export interface AssetService {
  listForCurrentUser(): Promise<Asset[]>;
  getById(id: string): Promise<Asset>;
  create(input: CreateAssetFormValues): Promise<Asset>;
}
