import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/core/query/keys';
import type { UpdateTechnicianProfileFormValues } from '@/schemas/technician-profile.schema';
import { services } from '@/services';

export function useTechnicianProfileQuery() {
  return useQuery({
    queryKey: queryKeys.technicianProfile,
    queryFn: () => services.technicians.getProfile(),
  });
}

export function useUpdateTechnicianProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTechnicianProfileFormValues) => services.technicians.updateProfile(input),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.technicianProfile, profile);
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
