import { apiRequest } from '@/services/api/client';
import type { BackendExtraExpenseResponse } from '@/services/api/backend-types';
import {
  mapExtraExpenseToPricingLineItem,
  mapPricingInputToExtraExpenseBody,
} from '@/services/api/mappers/pricing.mapper';
import { createWithAccessToken } from '@/services/api/with-access-token';
import type { AuthService } from '@/services/auth/auth.service';
import type { PricingService } from '@/services/pricing/pricing.service';

export function createHttpPricingService(auth: AuthService): PricingService {
  const withToken = createWithAccessToken(auth);

  return {
    listForWorkOrder(workOrderId) {
      return withToken(async (token) => {
        const expenses = await apiRequest<BackendExtraExpenseResponse[]>(
          `/work-orders/${workOrderId}/extra-expenses`,
          { token },
        );
        return expenses.map((expense, index) => mapExtraExpenseToPricingLineItem(expense, index));
      });
    },

    saveLineItem(workOrderId, input) {
      return withToken(async (token) => {
        const body = mapPricingInputToExtraExpenseBody(input);
        if (input.id) {
          const updated = await apiRequest<BackendExtraExpenseResponse>(
            `/work-orders/${workOrderId}/extra-expenses/${input.id}`,
            {
              method: 'PATCH',
              token,
              body,
            },
          );
          return mapExtraExpenseToPricingLineItem(updated, 0);
        }

        const created = await apiRequest<BackendExtraExpenseResponse>(
          `/work-orders/${workOrderId}/extra-expenses`,
          {
            method: 'POST',
            token,
            body,
          },
        );
        return mapExtraExpenseToPricingLineItem(created, 0);
      });
    },

    deleteLineItem(workOrderId, lineItemId) {
      return withToken((token) =>
        apiRequest<void>(`/work-orders/${workOrderId}/extra-expenses/${lineItemId}`, {
          method: 'DELETE',
          token,
        }),
      );
    },
  };
}
