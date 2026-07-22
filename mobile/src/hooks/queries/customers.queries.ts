import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/core/query/keys';
import type { UpdateCustomerProfileFormValues } from '@/schemas/profile.schema';
import { services } from '@/services';

export function useCustomerCompanyQuery() {
  return useQuery({
    queryKey: queryKeys.customerCompany,
    queryFn: () => services.customers.getCurrentCompany(),
  });
}

export function useCustomerProfileQuery() {
  return useQuery({
    queryKey: queryKeys.customerProfile,
    queryFn: () => services.customers.getProfile(),
  });
}

export function useUpdateCustomerProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCustomerProfileFormValues) => services.customers.updateProfile(input),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.customerProfile, profile);
      queryClient.setQueryData(queryKeys.customerCompany, profile.company);
      queryClient.setQueryData(queryKeys.session, (current: Awaited<ReturnType<typeof services.auth.getSession>>) =>
        current
          ? {
              ...current,
              user: {
                ...current.user,
                email: profile.email,
                displayName: profile.displayName,
              },
            }
          : current,
      );
    },
  });
}
