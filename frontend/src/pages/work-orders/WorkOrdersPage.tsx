import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCustomersStore } from '../../store/customersStore'
import { useModalsStore } from '../../store/modals'
import { usePrintersStore } from '../../store/printersStore'
import { useWorkOrdersStore } from '../../store/workOrdersStore'
import { WorkOrderDetail } from './components/WorkOrderDetail'
import { WorkOrdersFilters, WorkOrdersTable } from './components/WorkOrdersTable'

export function WorkOrdersPage() {
  const navigate = useNavigate()
  const { workOrderId } = useParams()
  const selectedId = workOrderId ? Number(workOrderId) : null

  const workOrders = useWorkOrdersStore((state) => state.workOrders)
  const printers = usePrintersStore((state) => state.printers)
  const customers = useCustomersStore((state) => state.customers)

  const openModal = useModalsStore((state) => state.open)
  const [filter, setFilter] = useState('All')

  const visible = useMemo(
    () => (filter === 'All' ? workOrders : workOrders.filter((order) => order.stage === filter)),
    [filter, workOrders],
  )

  if (selectedId !== null && !Number.isNaN(selectedId)) {
    return (
      <div className="p-6 sm:p-8">
        <WorkOrderDetail
          workOrderId={selectedId}
          onBack={() => navigate('/work-orders')}
        />
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-copy">Operations</p>
          <h1 className="mt-1 text-page font-extrabold tracking-tight text-ink">
            Work orders
          </h1>
        </div>
        <button
          type="button"
          onClick={() => openModal('NewWorkOrder')}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-brand px-4 text-sm font-bold text-canvas transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <AddRoundedIcon fontSize="small" aria-hidden="true" />
          Create work order
        </button>
      </header>

      <WorkOrdersFilters filter={filter} onFilterChange={setFilter} />
      <WorkOrdersTable
        workOrders={visible}
        customerName={(customerId) =>
          customers.find((customer) => customer.id === customerId)?.name ?? '—'
        }
        printerLabel={(printerId) =>
          printerId
            ? (printers.find((printer) => printer.id === printerId)?.model ?? '—')
            : '—'
        }
        onOpen={(id) => navigate(`/work-orders/${id}`)}
      />

    </div>
  )
}
