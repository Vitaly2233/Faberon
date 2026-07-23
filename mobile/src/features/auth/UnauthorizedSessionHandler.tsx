import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect } from 'react';

import { queryKeys } from '@/core/query/keys';
import { registerUnauthorizedHandler } from '@/services/api/unauthorized';
import { services } from '@/services';

export function UnauthorizedSessionHandler() {
  const queryClient = useQueryClient();

  useEffect(() => {
    registerUnauthorizedHandler(async () => {
      await services.auth.clearSession();
      queryClient.setQueryData(queryKeys.session, null);
      queryClient.clear();
      router.replace('/(auth)/login');
    });
  }, [queryClient]);

  return null;
}
