import { apiRequest } from '@/services/api/client';
import { createWithAccessToken } from '@/services/api/with-access-token';
import type { AuthService } from '@/services/auth/auth.service';
import type { SavePricingLineItemInput, PricingService } from '@/services/pricing/pricing.service';
import type { PricingLineItem } from '@/types/pricing';

export function createHttpPricingService(auth: AuthService): PricingService {
  const withToken = createWithAccessToken(auth);

  return {
    listForWorkOrder(workOrderId: string) {
      return withToken((token) =>
        apiRequest<PricingLineItem[]>(`/work-orders/${workOrderId}/pricing`, { token }),
      );
    },

    saveLineItem(workOrderId: string, input: SavePricingLineItemInput) {
      const path = input.id
        ? `/work-orders/${workOrderId}/pricing/${input.id}`
        : `/work-orders/${workOrderId}/pricing`;
      return withToken((token) =>
        apiRequest<PricingLineItem>(path, {
          method: input.id ? 'PATCH' : 'POST',
          token,
          body: input,
        }),
      );
    },

    deleteLineItem(workOrderId: string, lineItemId: string) {
      return withToken((token) =>
        apiRequest<void>(`/work-orders/${workOrderId}/pricing/${lineItemId}`, {
          method: 'DELETE',
          token,
        }),
      );
    },
  };
}
