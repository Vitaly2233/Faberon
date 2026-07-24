export const productsQueryKey = ['products'] as const

export function productsByCustomerQueryKey(customerId: string) {
  return [...productsQueryKey, { customerId }] as const
}
