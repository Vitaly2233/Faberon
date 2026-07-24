import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCustomer } from '../../../api/customers'
import { customersQueryKey } from './customerQueryKeys'

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: customersQueryKey })
    },
  })
}
