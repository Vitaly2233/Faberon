import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useCustomersStore } from '../../store/customersStore'
import { CustomerOverview } from './components/details/CustomerOverview'

export function CustomerDetailsPage() {
  const navigate = useNavigate()
  const { customerId } = useParams()
  const customer = useCustomersStore((state) =>
    customerId ? state.customers.find((entry) => entry.id === customerId) : undefined,
  )

  if (!customer) {
    return <Navigate to="/customers" replace />
  }

  return (
    <div className="p-6 sm:p-8">
      <CustomerOverview customer={customer} onBack={() => navigate('/customers')} />
    </div>
  )
}
