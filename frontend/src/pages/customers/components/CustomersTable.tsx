import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import { DataTable, DataTableRow } from '../../../components/DataTable'
import type { Customer } from '../types'

type CustomersTableProps = {
  customers: Customer[]
  printerCount: (customerId: string) => number
  openWorkOrderCount: (customerId: string) => number
  onCustomerOpen: (customerId: string) => void
}

export function CustomersTable({
  customers,
  printerCount,
  openWorkOrderCount,
  onCustomerOpen,
}: CustomersTableProps) {
  return (
    <DataTable
      ariaLabel="Customers"
      minWidthClassName="min-w-table-lg"
      columns={
        <>
          <th className="py-3 pl-5">Customer</th>
          <th className="py-3">Contact person</th>
          <th className="py-3">Address</th>
          <th className="py-3 text-center">Printers</th>
          <th className="py-3 pr-5 text-center">Open WOs</th>
        </>
      }
      empty={
        customers.length === 0 ? { colSpan: 5, message: 'No customers found.' } : undefined
      }
    >
      {customers.map((customer) => {
        const printers = printerCount(customer.id)
        const openOrders = openWorkOrderCount(customer.id)

        return (
          <DataTableRow key={customer.id} onClick={() => onCustomerOpen(customer.id)}>
            <td className="py-3.5 pl-5">
              <div className="flex items-center gap-2.5">
                <span className="flex size-6 items-center justify-center rounded-md border border-line bg-brand-soft text-copy">
                  <BusinessOutlinedIcon sx={{ fontSize: 14 }} aria-hidden="true" />
                </span>
                <span className="font-bold text-ink">{customer.name}</span>
              </div>
            </td>
            <td className="py-3.5">
              <p className="font-semibold text-ink">{customer.contactName}</p>
              <p className="text-2xs text-copy">{customer.contactEmail}</p>
            </td>
            <td className="max-w-56 truncate py-3.5 text-copy">{customer.billingAddress}</td>
            <td className="py-3.5 text-center text-copy">{printers}</td>
            <td className="py-3.5 pr-5 text-center">
              {openOrders > 0 ? (
                <span className="inline-flex rounded-md bg-warning-soft px-1.5 py-0.5 text-2xs font-extrabold text-warning">
                  {openOrders}
                </span>
              ) : (
                <span className="text-inactive">0</span>
              )}
            </td>
          </DataTableRow>
        )
      })}
    </DataTable>
  )
}
