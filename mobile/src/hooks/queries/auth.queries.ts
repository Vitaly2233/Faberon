import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/core/query/keys';
import type { LoginFormValues } from '@/schemas/auth.schema';
import { services } from '@/services';

export function useSessionQuery() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: () => services.auth.getSession(),
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginFormValues) => services.auth.login(input),
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.session, session);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => services.auth.logout(),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.session, null);
      queryClient.clear();
    },
  });
}
