import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { useCompanyStore } from '../../../store/companyStore'
import { useCustomersStore } from '../../../store/customersStore'
import type { WorkOrderRecord } from '../../../store/workOrdersStore'
import { formatMoney } from '../../../store/workOrderTypes'
import { Modal } from './Modal'

type InvoiceModalProps = {
  workOrder: WorkOrderRecord
  onClose: () => void
}

export function InvoiceModal({ workOrder, onClose }: InvoiceModalProps) {
  const company = useCompanyStore((state) => state.company)
  const customer = useCustomersStore((state) =>
    state.customers.find((entry) => entry.id === workOrder.customerId),
  )
  const items = workOrder.lineItems.filter((item) => !item.hidden)
  const total = items.reduce((sum, item) => sum + item.invoice, 0)

  const printInvoice = () => {
    const rows = workOrder.invoiceFinalOnly
      ? ''
      : items
          .map(
            (item) =>
              `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${item.name}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">$${item.invoice.toFixed(2)}</td></tr>`,
          )
          .join('')

    const html = `<!doctype html><html><head><title>Invoice WO-${workOrder.id}</title><style>body{font-family:Inter,Arial,sans-serif;color:#191919;max-width:640px;margin:40px auto;padding:0 24px}h1{font-size:22px;margin:0}table{width:100%;border-collapse:collapse;margin-top:24px;font-size:13px}.tot{font-size:20px;font-weight:800;text-align:right;margin-top:16px}.muted{color:#616161;font-size:12px}</style></head><body>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="display:flex;align-items:center;gap:12px">${company.logo ? `<img src="${company.logo}" style="width:44px;height:44px;border-radius:8px;object-fit:cover"/>` : ''}<div><h1>${company.name}</h1><div class="muted">${company.address}</div></div></div>
        <div style="text-align:right"><div style="font-weight:800;font-size:18px">Invoice</div><div class="muted">WO #${workOrder.id} · ${new Date().toLocaleDateString()}</div></div>
      </div>
      <div style="margin-top:24px"><div class="muted">Bill to</div><div style="font-weight:700">${customer?.name ?? ''}</div><div class="muted">${customer?.billingAddress ?? ''}</div></div>
      ${workOrder.invoiceFinalOnly ? '' : `<table><thead><tr><th style="text-align:left;border-bottom:2px solid #191919;padding-bottom:6px;font-size:11px;text-transform:uppercase;letter-spacing:.05em">Description</th><th style="text-align:right;border-bottom:2px solid #191919;padding-bottom:6px;font-size:11px;text-transform:uppercase;letter-spacing:.05em">Amount</th></tr></thead><tbody>${rows}</tbody></table>`}
      <div class="tot">Total due: $${total.toFixed(2)}</div>
      </body></html>`

    const popup = window.open('', '_blank')
    if (!popup) return
    popup.document.write(html)
    popup.document.close()
    popup.focus()
    popup.print()
  }

  return (
    <Modal
      title={`Invoice — WO #${workOrder.id}`}
      subtitle="Preview. Print or save as PDF (no email is sent)."
      onClose={onClose}
    >
      <div className="rounded-xl border border-line bg-surface p-6 text-ink">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company.logo ? (
              <img src={company.logo} alt="" className="size-10 rounded-lg object-cover" />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand text-sm font-extrabold text-surface">
                {company.name.slice(0, 1)}
              </div>
            )}
            <div>
              <p className="text-sm font-extrabold">{company.name}</p>
              <p className="text-caption text-copy">{company.address}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-extrabold">Invoice</p>
            <p className="text-caption text-copy">WO #{workOrder.id}</p>
          </div>
        </div>
        <div className="mt-4 text-xs">
          <span className="text-copy">Bill to</span>
          <p className="font-bold">{customer?.name}</p>
          <p className="text-copy">{customer?.billingAddress}</p>
        </div>
        {!workOrder.invoiceFinalOnly && (
          <table className="mt-4 w-full text-xs">
            <thead>
              <tr className="border-b-2 border-ink text-left text-2xs font-extrabold uppercase tracking-wide">
                <th className="pb-1.5">Description</th>
                <th className="pb-1.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-line-soft">
                  <td className="py-1.5">{item.name || '—'}</td>
                  <td className="py-1.5 text-right font-mono">{formatMoney(item.invoice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {workOrder.invoiceFinalOnly && (
          <p className="mt-4 text-caption italic text-copy">
            Itemized breakdown hidden — client sees the final price only.
          </p>
        )}
        <p className="mt-4 text-right font-mono text-lg font-bold">
          Total due: {formatMoney(total)}
        </p>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="h-9 cursor-pointer rounded-lg px-3.5 text-sm font-bold text-copy transition hover:bg-canvas hover:text-ink"
        >
          Close
        </button>
        <button
          type="button"
          onClick={printInvoice}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-brand px-3.5 text-sm font-bold text-surface transition hover:bg-brand-strong"
        >
          <DescriptionOutlinedIcon fontSize="small" aria-hidden="true" />
          Print / Save as PDF
        </button>
      </div>
    </Modal>
  )
}
