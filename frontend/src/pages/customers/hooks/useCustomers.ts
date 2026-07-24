import { useQuery } from '@tanstack/react-query'
import { listCustomers } from '../../../api/customers'
import type { Customer } from '../types'
import { toCustomerListItem } from '../types'
import { customersListQueryKey } from './customerQueryKeys'

type UseCustomersResult = {
  customers: Customer[]
  loading: boolean
  error: string | null
  reload: () => void
}

export function useCustomers(): UseCustomersResult {
  const query = useQuery({
    queryKey: customersListQueryKey,
    queryFn: async () => {
      const rows = await listCustomers()
      return rows.map(toCustomerListItem)
    },
  })

  return {
    customers: query.data ?? [],
    loading: query.isPending,
    error:
      query.error instanceof Error
        ? query.error.message
        : query.error
          ? 'Failed to load customers.'
          : null,
    reload: () => {
      void query.refetch()
    },
  }
}
