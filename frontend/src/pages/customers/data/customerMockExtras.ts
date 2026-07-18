import type { CustomerDetail } from '../types'

export type MockPrinter = {
  model: string
  serial: string
  ownership: 'owned' | 'rented'
  addedAt: string
}

export type MockWorkOrder = {
  id: string
  problem: string
  stage: string
  createdAt: string
}

const printersByCustomer: Record<string, MockPrinter[]> = {
  'grand-hotel': [
    { model: 'HP LaserJet M607', serial: 'SN-HP-88213', ownership: 'owned', addedAt: 'Mar 12, 2024' },
    { model: 'Canon PIXMA G7020', serial: 'SN-CN-40551', ownership: 'rented', addedAt: 'May 20, 2024' },
  ],
  'city-library': [
    { model: 'Brother HL-L8360', serial: 'SN-BR-11002', ownership: 'owned', addedAt: 'Nov 2, 2023' },
  ],
  'river-tech': [
    { model: 'Epson SureColor T5170', serial: 'SN-EP-77410', ownership: 'owned', addedAt: 'Jan 15, 2024' },
  ],
}

const workOrdersByCustomer: Record<string, MockWorkOrder[]> = {
  'grand-hotel': [
    {
      id: '1042',
      problem: 'Paper jams repeatedly and prints with faint vertical lines.',
      stage: 'Waiting for parts',
      createdAt: 'Jul 14, 2026',
    },
  ],
  'city-library': [
    {
      id: '1043',
      problem: 'Scheduled preventive maintenance and drum inspection.',
      stage: 'Waiting',
      createdAt: 'Jul 16, 2026',
    },
  ],
  'river-tech': [
    {
      id: '1044',
      problem: 'Plotter produces banding on large-format color prints.',
      stage: 'Repaired',
      createdAt: 'Jul 11, 2026',
    },
  ],
}

export function getCustomerPrinters(customer: CustomerDetail): MockPrinter[] {
  return printersByCustomer[customer.id] ?? []
}

export function getCustomerWorkOrders(customer: CustomerDetail): MockWorkOrder[] {
  return workOrdersByCustomer[customer.id] ?? []
}
