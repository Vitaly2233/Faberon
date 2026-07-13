import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { CompanyInformation } from './components/details/CompanyInformation'
import { CustomerHeader } from './components/details/CustomerHeader'
import { RecentActivity } from './components/details/RecentActivity'
import { ServiceSummary } from './components/details/ServiceSummary'
import { UpcomingSchedule } from './components/details/UpcomingSchedule'
import { getCustomerById } from './data/customers'

export function CustomerDetailsPage() {
  const navigate = useNavigate()
  const { customerId } = useParams()
  const customer = customerId ? getCustomerById(customerId) : undefined

  if (!customer) {
    return <Navigate to="/customers" replace />
  }

  return (
    <div className="p-3 sm:p-5">
      <CustomerHeader
        customer={customer}
        onBack={() => navigate('/customers')}
        onEdit={() => undefined}
        onTabSelect={() => undefined}
      />
      <div className="mt-4 grid items-start gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <div className="space-y-3">
          <CompanyInformation customer={customer} />
          <ServiceSummary customer={customer} />
        </div>
        <div className="space-y-3">
          <RecentActivity onViewAll={() => undefined} />
          <UpcomingSchedule />
        </div>
      </div>
    </div>
  )
}
