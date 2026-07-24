import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { CustomerOverview } from './components/details/CustomerOverview'
import { useCustomerDetail } from './hooks/useCustomerDetail'

export function CustomerDetailsPage() {
  const { customerId } = useParams()

  if (!customerId) {
    return <Navigate to="/customers" replace />
  }

  return <CustomerDetailsContent customerId={customerId} />
}

function CustomerDetailsContent({ customerId }: { customerId: string }) {
  const navigate = useNavigate()
  const { customer, printers, workOrders, loading, error, notFound } =
    useCustomerDetail(customerId)

  if (notFound) {
    return <Navigate to="/customers" replace />
  }

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-sm text-copy">Loading customer…</p>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-sm text-danger" role="alert">
          {error ?? 'Failed to load customer.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/customers')}
          className="mt-4 cursor-pointer text-xs font-semibold text-copy transition hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
        >
          Back to customers
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8">
      <CustomerOverview
        customer={customer}
        printers={printers}
        workOrders={workOrders}
        onBack={() => navigate('/customers')}
      />
    </div>
  )
}
