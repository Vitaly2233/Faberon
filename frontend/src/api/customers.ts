import type { components } from './generated/schema'
import { apiClient } from './client'

type CustomerResponse = components['schemas']['CustomerResponse']

export async function listCustomers(): Promise<CustomerResponse[]> {
  const { data, error, response } = await apiClient.GET('/api/v1/customers', {
    params: {
      query: {
        populate: 'contact',
      },
    },
  })

  if (error) {
    if (response.status === 401) throw new Error('Sign in to view customers.')

    throw new Error('Failed to load customers.')
  }

  return data
}

export async function getCustomer(customerId: string): Promise<CustomerResponse> {
  const { data, error, response } = await apiClient.GET('/api/v1/customers/{customerId}', {
    params: {
      path: { customerId },
      query: {
        populate: 'contact',
      },
    },
  })

  if (error) {
    if (response.status === 401) throw new Error('Sign in to view customers.')
    if (response.status === 404) throw new Error('Customer not found.')

    throw new Error('Failed to load customer.')
  }

  return data
}
