import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useCustomersStore } from '../../store/customersStore'
import { useModalsStore } from '../../store/modals'
import { usePrintersStore } from '../../store/printersStore'
import { PrinterDetail } from './components/PrinterDetail'
import { PrintersTable } from './components/PrintersTable'

export function PrintersPage() {
  const navigate = useNavigate()
  const { printerId } = useParams()
  const printers = usePrintersStore((state) => state.printers)
  const customers = useCustomersStore((state) => state.customers)
  const openModal = useModalsStore((state) => state.open)

  if (printerId) {
    const printer = printers.find((entry) => entry.id === printerId)
    if (!printer) {
      return <Navigate to="/printers" replace />
    }

    return (
      <div className="p-6 sm:p-8">
        <PrinterDetail printerId={printerId} onBack={() => navigate('/printers')} />
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-copy">Assets</p>
          <h1 className="mt-1 text-page font-extrabold tracking-tight text-ink">Printers</h1>
        </div>
        <button
          type="button"
          onClick={() => openModal('NewPrinter')}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-brand px-4 text-sm font-bold text-canvas transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <AddRoundedIcon fontSize="small" aria-hidden="true" />
          Add printer
        </button>
      </header>

      <PrintersTable
        printers={printers}
        customerName={(customerId) =>
          customers.find((customer) => customer.id === customerId)?.name ?? '—'
        }
        onPrinterOpen={(id) => navigate(`/printers/${id}`)}
      />
    </div>
  )
}
