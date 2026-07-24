export const customersQueryKey = ['customers'] as const

export const customersListQueryKey = [...customersQueryKey, 'list'] as const

export function customerDetailQueryKey(customerId: string) {
  return [...customersQueryKey, customerId] as const
}
