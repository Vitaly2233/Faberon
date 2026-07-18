import { DataTable, DataTableRow } from '../../../components/DataTable'
import { WORK_ORDER_STAGES, type WorkOrderStage } from '../../../store/types/work-order'
import { formatDate } from '../../../store/types/work-order'
import type { WorkOrderRecord } from '../../../store/workOrdersStore'
import { StageBadge, StatusBadge } from './StatusBadge'

type WorkOrdersTableProps = {
  workOrders: WorkOrderRecord[]
  customerName: (customerId: string) => string
  printerLabel: (printerId: string | null) => string
  onOpen: (id: number) => void
}

export function WorkOrdersFilters({
  filter,
  onFilterChange,
}: {
  filter: string
  onFilterChange: (filter: string) => void
}) {
  const filters = ['All', ...WORK_ORDER_STAGES]

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {filters.map((entry) => (
        <button
          key={entry}
          type="button"
          onClick={() => onFilterChange(entry)}
          className={`h-8 cursor-pointer rounded-full border px-3 text-xs font-semibold transition ${
            filter === entry
              ? 'border-brand bg-brand text-canvas'
              : 'border-line bg-surface text-ink hover:bg-brand-soft'
          }`}
        >
          {entry}
        </button>
      ))}
    </div>
  )
}

export function WorkOrdersTable({
  workOrders,
  customerName,
  printerLabel,
  onOpen,
}: WorkOrdersTableProps) {
  return (
    <DataTable
      minWidthClassName="min-w-table-xl"
      columns={
        <>
          <th className="py-3 pl-5">WO #</th>
          <th className="py-3">Customer</th>
          <th className="py-3">Printer</th>
          <th className="py-3">Problem</th>
          <th className="py-3">Type</th>
          <th className="py-3">Stage</th>
          <th className="py-3">Assigned</th>
          <th className="py-3 pr-5">Est. ready</th>
        </>
      }
      empty={
        workOrders.length === 0
          ? { colSpan: 8, message: 'No work orders in this stage.' }
          : undefined
      }
    >
      {workOrders.map((order) => (
        <DataTableRow key={order.id} onClick={() => onOpen(order.id)}>
          <td className="py-3.5 pl-5 font-mono font-bold text-ink">#{order.id}</td>
          <td className="py-3.5 font-semibold text-ink">{customerName(order.customerId)}</td>
          <td className="py-3.5 text-copy">{printerLabel(order.printerId)}</td>
          <td className="max-w-56 truncate py-3.5 text-copy">{order.problem}</td>
          <td className="py-3.5">
            <StatusBadge tone={order.type === 'client-requested' ? 'info' : 'inactive'}>
              {order.type === 'client-requested' ? 'Client' : 'Company'}
            </StatusBadge>
          </td>
          <td className="py-3.5">
            <StageBadge stage={order.stage} />
          </td>
          <td className="py-3.5 text-copy">
            {order.assignedTo ?? <span className="text-inactive">Unassigned</span>}
          </td>
          <td className="py-3.5 pr-5 text-copy">
            {order.estimate ? (
              formatDate(order.estimate)
            ) : (
              <span className="text-inactive">—</span>
            )}
          </td>
        </DataTableRow>
      ))}
    </DataTable>
  )
}

export type { WorkOrderStage }
