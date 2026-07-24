import type { components } from '../../api/generated/schema'

type CustomerResponse = components['schemas']['CustomerResponse']
type ProductResponse = components['schemas']['ProductResponse']
type WorkOrderResponse = components['schemas']['WorkOrderResponse']

export type Customer = {
  id: string
  name: string
  contactName: string
  contactEmail: string
  billingAddress: string
}

export type CustomerDetail = Customer & {
  phone: string
}

export type CustomerPrinter = {
  id: string
  model: string
  serial: string
  ownership: 'by_client' | 'rented'
  addedAt: string
}

export type CustomerWorkOrder = {
  id: string
  number: number
  problem: string
  stage: WorkOrderResponse['stage']
  createdAt: string
}

function formatBillingAddress(customer: CustomerResponse): string {
  const addressParts = [customer.address, customer.city, customer.postalCode].filter(
    (part): part is string => Boolean(part),
  )
  return addressParts.length > 0 ? addressParts.join(', ') : '—'
}

export function toCustomerListItem(customer: CustomerResponse): Customer {
  return {
    id: customer.id,
    name: customer.name,
    contactName: customer.contact?.name ?? '—',
    contactEmail: customer.contact?.email ?? '—',
    billingAddress: formatBillingAddress(customer),
  }
}

export function toCustomerDetail(customer: CustomerResponse): CustomerDetail {
  return {
    ...toCustomerListItem(customer),
    phone: customer.contact?.phone ?? '—',
  }
}

export function toCustomerPrinter(product: ProductResponse): CustomerPrinter {
  return {
    id: product.id,
    model: `${product.manufacturer} ${product.model}`,
    serial: product.serialNumber,
    ownership: product.ownership,
    addedAt: '—',
  }
}

const workOrderStageLabels: Record<WorkOrderResponse['stage'], string> = {
  waiting: 'Waiting',
  diagnostics: 'Diagnostics',
  'waiting-parts': 'Waiting for parts',
  repaired: 'Repaired',
}

export function formatWorkOrderStage(stage: WorkOrderResponse['stage']): string {
  return workOrderStageLabels[stage]
}

export function toCustomerWorkOrder(workOrder: WorkOrderResponse): CustomerWorkOrder {
  return {
    id: workOrder.id,
    number: workOrder.number,
    problem: workOrder.description,
    stage: workOrder.stage,
    createdAt: new Date(workOrder.createdAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  }
}
