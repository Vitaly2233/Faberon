import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import type { LineItem } from '../../../store/types/work-order'
import { formatMoney } from '../../../store/types/work-order'

type LineItemsEditorProps = {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
}

export function LineItemsEditor({ items, onChange }: LineItemsEditorProps) {
  const updateItem = (id: string, patch: Partial<LineItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const totalActual = items.filter((item) => !item.hidden).reduce((sum, item) => sum + item.actual, 0)
  const totalInvoice = items
    .filter((item) => !item.hidden)
    .reduce((sum, item) => sum + item.invoice, 0)

  return (
    <article className="rounded-xl border border-line bg-surface p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold text-ink">Repair items & pricing</h2>
          <p className="mt-0.5 text-xs text-copy">
            Actual cost is internal. Invoice price is what the client is billed.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              {
                id: Math.random().toString(36).slice(2),
                name: '',
                actual: 0,
                invoice: 0,
                hidden: false,
              },
            ])
          }
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-canvas px-3 text-xs font-bold text-ink transition hover:bg-brand-soft"
        >
          <AddRoundedIcon fontSize="small" aria-hidden="true" />
          Add item
        </button>
      </div>

      {items.length === 0 && <p className="py-6 text-center text-xs text-copy">No items yet.</p>}

      {items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-table-lg text-left text-xs">
            <thead className="text-2xs font-extrabold uppercase tracking-wider text-copy">
              <tr>
                <th className="pb-2">Item</th>
                <th className="pb-2 text-right">Actual</th>
                <th className="pb-2 text-right">Invoice</th>
                <th className="pb-2 text-center">Hidden</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-line-soft">
                  <td className="py-2 pr-2">
                    <input
                      value={item.name}
                      onChange={(event) => updateItem(item.id, { name: event.target.value })}
                      placeholder="What was done"
                      className="h-8 w-full rounded-md border border-line bg-canvas px-2 text-xs text-ink placeholder:text-copy focus:border-brand focus:outline-none"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="number"
                      value={item.actual}
                      onChange={(event) =>
                        updateItem(item.id, { actual: Number(event.target.value) })
                      }
                      className="h-8 w-20 rounded-md border border-line bg-canvas px-2 text-right font-mono text-xs text-ink focus:border-brand focus:outline-none"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="number"
                      value={item.invoice}
                      onChange={(event) =>
                        updateItem(item.id, { invoice: Number(event.target.value) })
                      }
                      className="h-8 w-20 rounded-md border border-line bg-canvas px-2 text-right font-mono text-xs text-ink focus:border-brand focus:outline-none"
                    />
                  </td>
                  <td className="py-2 text-center">
                    <input
                      type="checkbox"
                      checked={item.hidden}
                      onChange={(event) => updateItem(item.id, { hidden: event.target.checked })}
                      className="size-3.5 accent-brand"
                      title="Hide from invoice & totals"
                    />
                  </td>
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      onClick={() => onChange(items.filter((entry) => entry.id !== item.id))}
                      className="cursor-pointer text-copy transition hover:text-danger"
                      aria-label="Remove item"
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-line font-mono font-bold text-ink">
                <td className="py-2.5 font-sans text-label font-extrabold uppercase tracking-wide text-copy">
                  Billable total
                </td>
                <td className="py-2.5 text-right text-copy">{formatMoney(totalActual)}</td>
                <td className="py-2.5 text-right">{formatMoney(totalInvoice)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </article>
  )
}
