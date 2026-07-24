import { useQuery } from '@tanstack/react-query'
import { getCustomer } from '../../../api/customers'
import { listProductsByCustomer } from '../../../api/products'
import { listWorkOrdersByCustomer } from '../../../api/work-orders'
import { productsByCustomerQueryKey } from '../../printers/hooks/productQueryKeys'
import { workOrdersByCustomerQueryKey } from '../../work-orders/hooks/workOrderQueryKeys'
import type { CustomerDetail, CustomerPrinter, CustomerWorkOrder } from '../types'
import {
  toCustomerDetail,
  toCustomerPrinter,
  toCustomerWorkOrder,
} from '../types'
import { customerDetailQueryKey } from './customerQueryKeys'

type UseCustomerDetailResult = {
  customer: CustomerDetail | null
  printers: CustomerPrinter[]
  workOrders: CustomerWorkOrder[]
  loading: boolean
  error: string | null
  notFound: boolean
}

export function useCustomerDetail(customerId: string): UseCustomerDetailResult {
  const customerQuery = useQuery({
    queryKey: customerDetailQueryKey(customerId),
    queryFn: async () => {
      const customer = await getCustomer(customerId)
      return toCustomerDetail(customer)
    },
    retry: false,
  })

  const productsQuery = useQuery({
    queryKey: productsByCustomerQueryKey(customerId),
    queryFn: async () => {
      const products = await listProductsByCustomer(customerId)
      return products.map(toCustomerPrinter)
    },
  })

  const workOrdersQuery = useQuery({
    queryKey: workOrdersByCustomerQueryKey(customerId),
    queryFn: async () => {
      const workOrders = await listWorkOrdersByCustomer(customerId)
      return workOrders.map(toCustomerWorkOrder)
    },
  })

  const notFound =
    customerQuery.isError &&
    customerQuery.error instanceof Error &&
    customerQuery.error.message === 'Customer not found.'

  return {
    customer: customerQuery.data ?? null,
    printers: productsQuery.data ?? [],
    workOrders: workOrdersQuery.data ?? [],
    loading: customerQuery.isPending,
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
