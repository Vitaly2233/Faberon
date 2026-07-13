import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomersTable } from './components/CustomersTable'
import { CustomersToolbar } from './components/CustomersToolbar'
import { customers } from './data/customers'
import { useCustomersStore } from '../../store/customersStore'

export function CustomersPage() {
  const navigate = useNavigate()
  const searchQuery = useCustomersStore((state) => state.searchQuery)
  const currentPage = useCustomersStore((state) => state.currentPage)
  const setSearchQuery = useCustomersStore((state) => state.setSearchQuery)
  const setCurrentPage = useCustomersStore((state) => state.setCurrentPage)

  useEffect(() => {
    console.log('Hello world')
  }, [])

  return (
    <div className="p-3 sm:p-5">
      <header className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-copy">Customers</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">Customers</h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('/customers/new')}
          className="flex h-10 cursor-pointer items-center gap-1 rounded-lg bg-brand px-4 text-xs font-semibold text-surface shadow-button transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <AddRoundedIcon fontSize="small" aria-hidden="true" />
          Add customer
        </button>
      </header>
      <div className="space-y-3">
        <CustomersToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={() => undefined}
        />
        <CustomersTable
          customers={customers}
          totalCustomers={128}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onCustomerOpen={(customerId) => navigate(`/customers/${customerId}`)}
        />
      </div>
    </div>
  )
}
