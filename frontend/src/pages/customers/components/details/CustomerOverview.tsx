import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import type { CustomerDetail, CustomerPrinter, CustomerWorkOrder } from '../../types'
import { formatWorkOrderStage } from '../../types'

type CustomerOverviewProps = {
  customer: CustomerDetail
  printers: CustomerPrinter[]
  workOrders: CustomerWorkOrder[]
  onBack: () => void
}

function StageBadge({ stage }: { stage: CustomerWorkOrder['stage'] }) {
  const tone =
    stage === 'repaired'
      ? 'bg-success-soft text-success'
      : stage === 'diagnostics'
        ? 'bg-info-soft text-info'
        : stage === 'waiting'
          ? 'bg-inactive-soft text-inactive'
          : 'bg-warning-soft text-warning'

  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-caption font-extrabold uppercase ${tone}`}>
      {formatWorkOrderStage(stage)}
    </span>
  )
}

function OwnershipBadge({ ownership }: { ownership: CustomerPrinter['ownership'] }) {
  const tone =
    ownership === 'rented' ? 'bg-info-soft text-info' : 'bg-inactive-soft text-inactive'
  const label = ownership === 'rented' ? 'rented' : 'owned'

  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-caption font-extrabold uppercase ${tone}`}>
      {label}
    </span>
  )
}

export function CustomerOverview({
  customer,
  printers,
  workOrders,
  onBack,
}: CustomerOverviewProps) {
  return (
    <main>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-copy transition hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
      >
        <ArrowBackRoundedIcon fontSize="small" aria-hidden="true" />
        Customers
      </button>

      <header className="mb-5">
        <p className="text-sm font-medium text-copy">Customer</p>
        <h1 className="mt-1 text-page font-extrabold tracking-tight text-ink">{customer.name}</h1>
      </header>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <article className="h-fit rounded-xl border border-line bg-surface p-4 shadow-card xl:col-span-4">
          <h2 className="mb-3 text-sm font-extrabold text-ink">Contact</h2>
          <dl className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-ink">
              <BusinessOutlinedIcon className="text-copy" fontSize="small" aria-hidden="true" />
              <span className="font-semibold">{customer.contactName}</span>
            </div>
            <div className="flex items-center gap-2 text-copy">
              <PhoneOutlinedIcon fontSize="small" aria-hidden="true" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-copy">
              <EmailOutlinedIcon fontSize="small" aria-hidden="true" />
              <span>{customer.contactEmail}</span>
            </div>
            <div className="flex items-start gap-2 text-copy">
              <LocationOnOutlinedIcon fontSize="small" aria-hidden="true" />
              <span>{customer.billingAddress}</span>
            </div>
          </dl>
        </article>

        <div className="space-y-4 xl:col-span-8">
          <article className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
            <div className="flex items-center gap-2 p-4">
              <PrintOutlinedIcon className="text-copy" fontSize="small" aria-hidden="true" />
              <h2 className="text-sm font-extrabold text-ink">Printers ({printers.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-table-md text-left text-xs">
                <thead className="border-y border-line bg-canvas text-caption font-extrabold uppercase tracking-wider text-copy">
                  <tr>
                    <th className="py-2.5 pl-4">Model</th>
                    <th className="py-2.5">Serial</th>
                    <th className="py-2.5">Ownership</th>
                    <th className="py-2.5 pr-4">Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {printers.map((printer) => (
                    <tr key={printer.id}>
                      <td className="py-2.5 pl-4 font-semibold text-ink">{printer.model}</td>
                      <td className="py-2.5 font-mono text-copy">{printer.serial}</td>
                      <td className="py-2.5">
                        <OwnershipBadge ownership={printer.ownership} />
                      </td>
                      <td className="py-2.5 pr-4 text-copy">{printer.addedAt}</td>
                    </tr>
                  ))}
                  {printers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-copy">
                        No printers linked yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <article className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
            <div className="p-4">
              <h2 className="text-sm font-extrabold text-ink">
                Work order history ({workOrders.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-table-md text-left text-xs">
                <thead className="border-y border-line bg-canvas text-caption font-extrabold uppercase tracking-wider text-copy">
                  <tr>
                    <th className="py-2.5 pl-4">WO #</th>
                    <th className="py-2.5">Problem</th>
                    <th className="py-2.5">Stage</th>
                    <th className="py-2.5 pr-4">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {workOrders.map((workOrder) => (
                    <tr key={workOrder.id}>
                      <td className="py-2.5 pl-4 font-mono font-bold text-ink">
                        #{workOrder.number}
                      </td>
                      <td className="max-w-60 truncate py-2.5 text-copy">{workOrder.problem}</td>
                      <td className="py-2.5">
                        <StageBadge stage={workOrder.stage} />
                      </td>
                      <td className="py-2.5 pr-4 text-copy">{workOrder.createdAt}</td>
                    </tr>
                  ))}
                  {workOrders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-copy">
                        No work orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
