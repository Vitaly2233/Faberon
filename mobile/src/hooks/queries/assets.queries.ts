import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/core/query/keys';
import type { CreateAssetFormValues } from '@/schemas/asset.schema';
import { services } from '@/services';

export function useAssetsQuery() {
  return useQuery({
    queryKey: queryKeys.assets,
    queryFn: () => services.assets.listForCurrentUser(),
  });
}

export function useAssetQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.asset(id),
    queryFn: () => services.assets.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateAssetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAssetFormValues) => services.assets.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assets });
    },
  });
}
