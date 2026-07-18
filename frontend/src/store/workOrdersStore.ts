import { create } from 'zustand'
import { seedPrinters, type PrinterRecord } from './printersSeed'
import {
  createId,
  todayIso,
  type LineItem,
  type WorkOrderRecord,
  type WorkOrderStage,
  type WorkOrderType,
} from './workOrderTypes'
import { seedWorkOrders } from './workOrdersSeed'

export type CreateWorkOrderInput = {
  type: WorkOrderType
  customerId: string
  printerId: string | null
  address: string
  contact: string
  problem: string
  invoiceFinalOnly: boolean
}

type WorkOrdersStore = {
  workOrders: WorkOrderRecord[]
  printers: PrinterRecord[]
  currentUser: string
  createWorkOrder: (input: CreateWorkOrderInput) => number
  updateWorkOrder: (id: number, patch: Partial<WorkOrderRecord>, note?: string) => void
  setLineItems: (id: number, lineItems: LineItem[]) => void
}

export const useWorkOrdersStore = create<WorkOrdersStore>((set, get) => ({
  workOrders: seedWorkOrders,
  printers: seedPrinters,
  currentUser: 'Mike Andrew',
  createWorkOrder: (input) => {
    const id = Math.max(1041, ...get().workOrders.map((order) => order.id)) + 1
    const createdAt = todayIso()
    const record: WorkOrderRecord = {
      ...input,
      id,
      stage: 'Waiting',
      assignedTo: null,
      estimate: null,
      createdAt,
      lineItems: [],
      history: [
        {
          id: createId(),
          date: createdAt,
          author: get().currentUser,
          text: `Work order created (${input.type === 'client-requested' ? 'client request' : 'company'}).`,
        },
      ],
    }

    set((state) => ({ workOrders: [record, ...state.workOrders] }))
    return id
  },
  updateWorkOrder: (id, patch, note) => {
    set((state) => ({
      workOrders: state.workOrders.map((order) => {
        if (order.id !== id) return order
        const history = note
          ? [
              ...order.history,
              {
                id: createId(),
                date: todayIso(),
                author: state.currentUser,
                text: note,
              },
            ]
          : order.history
        return { ...order, ...patch, history }
      }),
    }))
  },
  setLineItems: (id, lineItems) => {
    get().updateWorkOrder(id, { lineItems })
  },
}))

export function openWorkOrderCount(workOrders: WorkOrderRecord[]) {
  return workOrders.filter((order) => order.stage !== 'Confirmed by client').length
}

export type { WorkOrderStage, WorkOrderRecord, LineItem, PrinterRecord }
