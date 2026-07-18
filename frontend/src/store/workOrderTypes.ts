export const WORK_ORDER_STAGES = [
  'Waiting',
  'Travel & diagnosis',
  'Waiting for parts',
  'Repaired',
  'Confirmed by client',
] as const

export type WorkOrderStage = (typeof WORK_ORDER_STAGES)[number]
export type WorkOrderType = 'client-requested' | 'company'

export type LineItem = {
  id: string
  name: string
  actual: number
  invoice: number
  hidden: boolean
}

export type HistoryEntry = {
  id: string
  date: string
  author: string
  text: string
}

export type WorkOrderRecord = {
  id: number
  type: WorkOrderType
  customerId: string
  printerId: string | null
  address: string
  contact: string
  problem: string
  stage: WorkOrderStage
  assignedTo: string | null
  estimate: string | null
  createdAt: string
  lineItems: LineItem[]
  history: HistoryEntry[]
  invoiceFinalOnly: boolean
}

export function createId() {
  return Math.random().toString(36).slice(2, 10)
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatMoney(value: number) {
  return `$${value.toFixed(2)}`
}

export function stageTone(
  stage: WorkOrderStage,
): 'success' | 'info' | 'warning' | 'inactive' {
  if (stage === 'Confirmed by client') return 'success'
  if (stage === 'Repaired') return 'info'
  if (stage === 'Waiting') return 'inactive'
  return 'warning'
}
