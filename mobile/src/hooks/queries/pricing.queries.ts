import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/core/query/keys';
import type { SavePricingLineItemInput } from '@/services/pricing/pricing.service';
import { services } from '@/services';

export function usePricingQuery(workOrderId: string) {
  return useQuery({
    queryKey: queryKeys.pricing(workOrderId),
    queryFn: () => services.pricing.listForWorkOrder(workOrderId),
    enabled: Boolean(workOrderId),
  });
}

export function useSavePricingLineItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workOrderId,
      input,
    }: {
      workOrderId: string;
      input: SavePricingLineItemInput;
    }) => services.pricing.saveLineItem(workOrderId, input),
    onSuccess: (_, { workOrderId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing(workOrderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoice(workOrderId) });
    },
  });
}

export function useDeletePricingLineItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workOrderId, lineItemId }: { workOrderId: string; lineItemId: string }) =>
      services.pricing.deleteLineItem(workOrderId, lineItemId),
    onSuccess: (_, { workOrderId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing(workOrderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoice(workOrderId) });
    },
  });
}
