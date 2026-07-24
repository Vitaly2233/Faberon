import { useQuery } from '@tanstack/react-query'
import { getCustomer } from '../../../api/customers'
import { listProductsByCustomer } from '../../../api/products'
import { listWorkOrdersByCustomer } from '../../../api/work-orders'
import type { CustomerDetail, CustomerPrinter, CustomerWorkOrder } from '../types'
import {
  toCustomerDetail,
  toCustomerPrinter,
  toCustomerWorkOrder,
} from '../types'

type UseCustomerDetailResult = {
  customer: CustomerDetail | null
  printers: CustomerPrinter[]
  workOrders: CustomerWorkOrder[]
  loading: boolean
  error: string | null
  notFound: boolean
}

export function useCustomerDetail(customerId: string | undefined): UseCustomerDetailResult {
  const customerQuery = useQuery({
    queryKey: ['customers', customerId],
    queryFn: async () => {
      const customer = await getCustomer(customerId!)
      return toCustomerDetail(customer)
    },
    enabled: Boolean(customerId),
    retry: false,
  })

  const productsQuery = useQuery({
    queryKey: ['products', { customerId }],
    queryFn: async () => {
      const products = await listProductsByCustomer(customerId!)
      return products.map(toCustomerPrinter)
    },
    enabled: Boolean(customerId),
  })

  const workOrdersQuery = useQuery({
    queryKey: ['work-orders', { customerId }],
    queryFn: async () => {
      const workOrders = await listWorkOrdersByCustomer(customerId!)
      return workOrders.map(toCustomerWorkOrder)
    },
    enabled: Boolean(customerId),
  })

  const notFound =
    !customerId ||
    (customerQuery.isError &&
      customerQuery.error instanceof Error &&
      customerQuery.error.message === 'Customer not found.')

  return {
    customer: customerQuery.data ?? null,
    printers: productsQuery.data ?? [],
    workOrders: workOrdersQuery.data ?? [],
    loading: Boolean(customerId) && customerQuery.isPending,
    error:
      notFound
        ? null
        : customerQuery.error instanceof Error
          ? customerQuery.error.message
          : customerQuery.error
            ? 'Failed to load customer.'
            : null,
    notFound,
  }
}
