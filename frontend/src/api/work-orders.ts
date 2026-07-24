import type { components } from './generated/schema'
import { apiClient } from './client'

type WorkOrderResponse = components['schemas']['WorkOrderResponse']

export async function listWorkOrdersByCustomer(
  customerId: string,
): Promise<WorkOrderResponse[]> {
  const { data, error, response } = await apiClient.GET('/api/v1/work-orders', {
    params: {
      query: { customerId },
    },
  })

  if (error) {
    if (response.status === 401) throw new Error('Sign in to view work orders.')

    throw new Error('Failed to load work orders.')
  }

  return data
}
