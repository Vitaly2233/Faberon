import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { useMemo, useState } from 'react'
import { useCompanyStore } from '../../../store/companyStore'
import { useCustomersStore } from '../../../store/customersStore'
import { usePrintersStore } from '../../../store/printersStore'
import { useWorkOrdersStore } from '../../../store/workOrdersStore'
import { formatDate } from '../../../store/types/work-order'
import { StageBadge } from '../../work-orders/components/StatusBadge'
import { WarrantyBadge } from './WarrantyBadge'

type PrinterDetailProps = {
  printerId: string
  onBack: () => void
}

export function PrinterDetail({ printerId, onBack }: PrinterDetailProps) {
  const printer = usePrintersStore((state) =>
    state.printers.find((entry) => entry.id === printerId),
  )
  const customerId = printer?.customerId
  const customer = useCustomersStore((state) =>
    customerId ? state.customers.find((entry) => entry.id === customerId) : undefined,
  )
  const company = useCompanyStore((state) => state.company)
  const allWorkOrders = useWorkOrdersStore((state) => state.workOrders)
  const workOrders = useMemo(
    () => allWorkOrders.filter((order) => order.printerId === printerId),
    [allWorkOrders, printerId],
  )
  const addPageReading = usePrintersStore((state) => state.addPageReading)
  const removePageReading = usePrintersStore((state) => state.removePageReading)

  const [reading, setReading] = useState({ bw: '', color: '' })

  if (!printer) return null

  const latest = printer.pages[printer.pages.length - 1]
  const latestTotal = latest ? latest.bw + latest.color : 0
  const canLog = reading.bw !== '' || reading.color !== ''

  const handleLogReading = () => {
    if (!canLog) return
    addPageReading(printerId, Number(reading.bw || 0), Number(reading.color || 0))
    setReading({ bw: '', color: '' })
  }

  return (
    <main>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-copy transition hover:text-ink"
      >
        <ArrowBackRoundedIcon fontSize="small" aria-hidden="true" />
        Printers
      </button>

      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-copy">
            {printer.type} · {customer?.name ?? '—'}
          </p>
          <h1 className="mt-1 text-page font-extrabold tracking-tight text-ink">
            {printer.manufacturer} {printer.model}
          </h1>
        </div>
        <WarrantyBadge warranty={printer.warranty} />
      </header>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-5">
          <article className="rounded-xl border border-line bg-surface p-4 shadow-card">
            <h2 className="mb-3 text-sm font-extrabold text-ink">Printer details</h2>
            <dl className="space-y-2.5 text-xs">
              {[
                ['Type', printer.type],
                ['Manufacturer', printer.manufacturer],
                ['Model', printer.model],
                ['Serial', printer.serial],
                ['Customer', customer?.name ?? '—'],
                ['Ownership', printer.ownership],
                ['Address', printer.address || `${company.address} (default)`],
                ['User / contact', printer.contact || '—'],
                ['Added to customer', formatDate(printer.addedAt)],
                ['Warranty until', printer.warranty ? formatDate(printer.warranty) : '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-copy">{label}</dt>
                  <dd className="text-right font-semibold capitalize text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </article>

          <article className="rounded-xl border border-line bg-surface p-4 shadow-card">
            <div className="mb-1 flex items-baseline justify-between">
              <h2 className="text-sm font-extrabold text-ink">Page counter</h2>
              {latest && (
                <span className="font-mono text-lg font-bold text-ink">
                  {latestTotal.toLocaleString()}
                </span>
              )}
            </div>
            <p className="mb-3 text-caption text-copy">
              Mono &amp; color printed pages recorded over time.
            </p>

            <div className="mb-3 max-h-44 space-y-1.5 overflow-y-auto">
              {printer.pages.length === 0 && (
                <p className="py-3 text-center text-caption text-copy">No readings yet.</p>
              )}
              {[...printer.pages].reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="group flex items-center justify-between gap-2 rounded-md bg-canvas px-2.5 py-1.5 text-caption"
                >
                  <span className="text-copy">{formatDate(entry.date)}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-flex rounded-full bg-inactive-soft px-2 py-0.5 text-2xs font-extrabold uppercase tracking-wide text-inactive">
                        B/W
                      </span>
                      <span className="font-mono font-bold text-ink">
                        {entry.bw.toLocaleString()}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-flex rounded-full bg-info-soft px-2 py-0.5 text-2xs font-extrabold uppercase tracking-wide text-info">
                        Color
                      </span>
                      <span className="font-mono font-bold text-ink">
                        {entry.color.toLocaleString()}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removePageReading(printerId, entry.id)}
                      aria-label="Remove reading"
                      className="cursor-pointer text-copy opacity-0 transition hover:text-danger group-hover:opacity-100"
                    >
                      <DeleteOutlineRoundedIcon sx={{ fontSize: 14 }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <label className="flex-1">
                <span className="mb-1 block text-2xs font-bold uppercase tracking-wide text-copy">
                  B/W pages
                </span>
                <input
                  type="number"
                  value={reading.bw}
                  onChange={(event) =>
                    setReading((current) => ({ ...current, bw: event.target.value }))
                  }
                  placeholder="0"
                  className="field-control"
                />
              </label>
              <label className="flex-1">
                <span className="mb-1 block text-2xs font-bold uppercase tracking-wide text-copy">
                  Color pages
                </span>
                <input
                  type="number"
                  value={reading.color}
                  onChange={(event) =>
                    setReading((current) => ({ ...current, color: event.target.value }))
                  }
                  placeholder="0"
                  className="field-control"
                />
              </label>
              <button
                type="button"
                disabled={!canLog}
                onClick={handleLogReading}
                className="h-10 cursor-pointer self-end rounded-lg border border-line bg-brand-soft px-3.5 text-sm font-bold text-ink transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-50"
              >
                Log
              </button>
            </div>
          </article>
        </div>

        <div className="xl:col-span-7">
          <article className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
            <div className="p-4">
              <h2 className="text-sm font-extrabold text-ink">
                Work order history ({workOrders.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-table-md text-left text-xs">
                <thead className="border-y border-line bg-canvas text-2xs font-extrabold uppercase tracking-wider text-copy">
                  <tr>
                    <th className="py-2.5 pl-4">WO #</th>
                    <th className="py-2.5">Problem</th>
                    <th className="py-2.5">Stage</th>
                    <th className="pr-4 py-2.5">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {workOrders.map((order) => (
                    <tr key={order.id} className="border-t border-line-soft">
                      <td className="py-2.5 pl-4 font-mono font-bold text-ink">#{order.id}</td>
                      <td className="max-w-60 truncate py-2.5 text-copy">{order.problem}</td>
                      <td className="py-2.5">
                        <StageBadge stage={order.stage} />
                      </td>
                      <td className="pr-4 py-2.5 text-copy">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                  {workOrders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-copy">
                        No work orders for this printer yet.
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
