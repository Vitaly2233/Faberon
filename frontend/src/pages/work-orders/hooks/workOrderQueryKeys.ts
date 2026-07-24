export const workOrdersQueryKey = ['work-orders'] as const

export function workOrdersByCustomerQueryKey(customerId: string) {
  return [...workOrdersQueryKey, { customerId }] as const
}
