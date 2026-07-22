import { env } from '@/constants/env';
import { apiRequest } from '@/services/api/client';
import type {
  BackendProductCategoryResponse,
  BackendProductResponse,
  BackendProductTypeResponse,
} from '@/services/api/backend-types';
import { mapAssetOwnershipToBackend, mapProductToAsset } from '@/services/api/mappers/product.mapper';
import { createApiError } from '@/services/api/errors';
import { createWithAccessToken } from '@/services/api/with-access-token';
import type { AuthService } from '@/services/auth/auth.service';
import type { AssetService } from '@/services/assets/asset.service';

const typeNameById = new Map<string, string>();

async function resolveDefaultProductTypeId(token: string): Promise<string> {
  if (env.defaultProductTypeId) {
    return env.defaultProductTypeId;
  }

  const categories = await apiRequest<BackendProductCategoryResponse[]>('/product-categories', {
    token,
  });
  const firstCategory = categories[0];
  if (!firstCategory) {
    throw createApiError('VALIDATION_ERROR', 'No product categories are configured on the server');
  }

  const types = await apiRequest<BackendProductTypeResponse[]>(
    `/product-categories/${firstCategory.id}/types`,
    { token },
  );
  const firstType = types[0];
  if (!firstType) {
    throw createApiError('VALIDATION_ERROR', 'No product types are configured on the server');
  }

  typeNameById.set(firstType.id, firstType.name);
  return firstType.id;
}

export function createHttpAssetService(auth: AuthService): AssetService {
  const withToken = createWithAccessToken(auth);

  return {
    listForCurrentUser() {
      return withToken(async (token) => {
        const session = await auth.getSession();
        const customerId = session?.user.customerId;
        const query = customerId ? `?customerId=${encodeURIComponent(customerId)}` : '';
        const products = await apiRequest<BackendProductResponse[]>(`/products${query}`, { token });
        return products.map((product) =>
          mapProductToAsset(product, typeNameById.get(product.typeId)),
        );
      });
    },

    getById(id) {
      return withToken(async (token) => {
        const product = await apiRequest<BackendProductResponse>(`/products/${id}`, { token });
        return mapProductToAsset(product, typeNameById.get(product.typeId));
      });
    },

    create(input) {
      return withToken(async (token) => {
        const session = await auth.getSession();
        const customerId = session?.user.customerId;
        if (!customerId) {
          throw createApiError('VALIDATION_ERROR', 'Customer account is not linked to a customer record');
        }

        const typeId = await resolveDefaultProductTypeId(token);
        const product = await apiRequest<BackendProductResponse>('/products', {
          method: 'POST',
          token,
          body: {
            customerId,
            typeId,
            manufacturer: input.manufacturer,
            model: input.model,
            serialNumber: input.serialNumber?.trim() || `SN-${Date.now()}`,
            ownership: mapAssetOwnershipToBackend(input.ownershipType),
            address: input.address ?? null,
            contactName: input.primaryContactName ?? null,
          },
        });

        return mapProductToAsset(product, typeNameById.get(product.typeId));
      });
    },
  };
}
