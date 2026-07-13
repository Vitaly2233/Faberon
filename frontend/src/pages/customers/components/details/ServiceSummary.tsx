import type { CustomerDetail } from '../../types'

type ServiceSummaryProps = {
  customer: CustomerDetail
}

export function ServiceSummary({ customer }: ServiceSummaryProps) {
  const metrics = [
    { label: 'Products', value: customer.products, emphasized: true },
    { label: 'Locations', value: customer.locations, emphasized: false },
    { label: 'Active contracts', value: customer.contracts, emphasized: true },
    { label: 'Open work orders', value: customer.openOrders, emphasized: false },
  ]

  return (
    <section className="rounded-xl border border-line bg-surface p-4 shadow-field">
      <h2 className="text-sm font-semibold text-ink">Service summary</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, emphasized }) => (
          <div
            key={label}
            className={`rounded-lg p-4 ${emphasized ? 'bg-brand-soft' : 'bg-canvas'}`}
          >
            <p className="text-2xl font-bold text-ink">{value}</p>
            <p className="mt-1 text-xs text-copy">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
