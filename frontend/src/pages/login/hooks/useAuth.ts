import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMe, login } from '../../../api/auth'
import { getAccessToken } from '../../../api/auth-token'

export const authMeQueryKey = ['auth', 'me'] as const

export function useMe() {
  return useQuery({
    queryKey: authMeQueryKey,
    queryFn: getMe,
    enabled: Boolean(getAccessToken()),
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authMeQueryKey })
    },
  })
}
