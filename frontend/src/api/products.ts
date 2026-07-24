import type { components } from './generated/schema'
import { apiClient } from './client'

type ProductResponse = components['schemas']['ProductResponse']

export async function listProductsByCustomer(
  customerId: string,
): Promise<ProductResponse[]> {
  const { data, error, response } = await apiClient.GET('/api/v1/products', {
    params: {
      query: { customerId },
    },
  })

  if (error) {
    if (response.status === 401) throw new Error('Sign in to view products.')

    throw new Error('Failed to load products.')
  }

  return data
}
