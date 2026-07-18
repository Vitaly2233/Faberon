import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { useNavigate } from 'react-router-dom'
import { useCustomersStore } from '../../store/customersStore'
import { useModalsStore } from '../../store/modals'
import { usePrintersStore } from '../../store/printersStore'
import { useWorkOrdersStore } from '../../store/workOrdersStore'
import { CustomersTable } from './components/CustomersTable'

export function CustomersPage() {
  const navigate = useNavigate()
  const customers = useCustomersStore((state) => state.customers)
  const printers = usePrintersStore((state) => state.printers)
  const workOrders = useWorkOrdersStore((state) => state.workOrders)
  const openModal = useModalsStore((state) => state.open)

  return (
    <div className="p-6 sm:p-8">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-copy">Directory</p>
          <h1 className="mt-1 text-page font-extrabold tracking-tight text-ink">Customers</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            openModal('NewCustomer')
          }}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-brand px-4 text-sm font-bold text-canvas transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <AddRoundedIcon fontSize="small" aria-hidden="true" />
          Add customer
        </button>
      </header>

      <CustomersTable
        customers={customers}
        printerCount={(customerId) =>
          printers.filter((printer) => printer.customerId === customerId).length
        }
        openWorkOrderCount={(customerId) =>
          workOrders.filter(
            (order) =>
              order.customerId === customerId && order.stage !== 'Confirmed by client',
          ).length
        }
        onCustomerOpen={(customerId) => navigate(`/customers/${customerId}`)}
      />
    </div>
  )
}
