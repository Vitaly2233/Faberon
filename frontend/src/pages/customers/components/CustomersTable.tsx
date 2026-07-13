import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import type { Customer } from '../types'

type CustomersTableProps = {
  customers: Customer[]
  totalCustomers: number
  currentPage: number
  onPageChange: (page: number) => void
  onCustomerOpen: (customerId: string) => void
}

function AttentionValue({ value }: { value: number }) {
  if (value === 0) {
    return <span>—</span>
  }

  return (
    <span className="inline-flex size-6 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand-strong">
      {value}
    </span>
  )
}

export function CustomersTable({
  customers,
  totalCustomers,
  currentPage,
  onPageChange,
  onCustomerOpen,
}: CustomersTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-field" aria-label="Customers">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left">
          <thead className="bg-canvas text-xs font-semibold uppercase text-copy">
            <tr>
              <th className="px-3 py-3">
                <input type="checkbox" className="size-4 accent-brand" aria-label="Select all customers" />
              </th>
              <th className="min-w-64 px-3 py-3">Customer</th>
              <th className="min-w-52 px-3 py-3">Main contact</th>
              <th className="px-3 py-3 text-center">Locations</th>
              <th className="px-3 py-3 text-center">Products</th>
              <th className="px-3 py-3 text-center">Attention</th>
              <th className="px-3 py-3 text-center">Open</th>
              <th className="px-3 py-3 text-center">Contracts</th>
              <th className="px-3 py-3 text-center">Unpaid</th>
              <th className="px-3 py-3">Portal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-xs text-copy">
            {customers.map((customer) => (
              <tr key={customer.id} className="transition hover:bg-canvas">
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    className="size-4 accent-brand"
                    aria-label={`Select ${customer.name}`}
                  />
                </td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => onCustomerOpen(customer.id)}
                    className="flex cursor-pointer items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-canvas text-copy">
                      <BusinessOutlinedIcon fontSize="small" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{customer.name}</p>
                      <p className="mt-0.5 text-xs text-copy">{customer.category}</p>
                    </div>
                  </button>
                </td>
                <td className="px-3 py-3">
                  <p className="font-medium text-ink">{customer.contactName}</p>
                  <p className="mt-0.5 text-xs text-copy">{customer.contactEmail}</p>
                </td>
                <td className="px-3 py-3 text-center">{customer.locations}</td>
                <td className="px-3 py-3 text-center">{customer.products}</td>
                <td className="px-3 py-3 text-center">
                  <AttentionValue value={customer.attention} />
                </td>
                <td className="px-3 py-3 text-center">{customer.openOrders}</td>
                <td className="px-3 py-3 text-center">{customer.contracts}</td>
                <td className="px-3 py-3 text-center">
                  <AttentionValue value={customer.unpaid} />
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${
                      customer.status === 'active'
                        ? 'bg-brand-soft text-brand-strong'
                        : 'bg-canvas text-copy'
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="flex items-center justify-between border-t border-line px-3 py-2 text-xs text-copy">
        <span>Showing {customers.length} of {totalCustomers} customers</span>
        <nav className="flex items-center gap-1" aria-label="Customer pages">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-line hover:border-brand focus-visible:outline-2 focus-visible:outline-brand"
            aria-label="Previous page"
          >
            <ChevronLeftRoundedIcon fontSize="small" />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`size-8 cursor-pointer rounded-lg border text-xs font-semibold focus-visible:outline-2 focus-visible:outline-brand ${
                page === currentPage
                  ? 'border-brand bg-brand text-surface'
                  : 'border-line bg-surface text-copy hover:border-brand'
              }`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-line hover:border-brand focus-visible:outline-2 focus-visible:outline-brand"
            aria-label="Next page"
          >
            <ChevronRightRoundedIcon fontSize="small" />
          </button>
        </nav>
      </footer>
    </section>
  )
}
