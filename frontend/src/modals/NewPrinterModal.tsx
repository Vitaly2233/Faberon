import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { useState } from 'react'
import { Modal } from '../components/Modal'
import { useCompanyStore } from '../store/companyStore'
import { useCustomersStore } from '../store/customersStore'
import { useModalsStore, type ModalOptions } from '../store/modals'
import { PRINTER_TYPES, type PrinterOwnership } from '../store/types/printer'
import { usePrintersStore } from '../store/printersStore'

type NewPrinterModalProps = {
  options: ModalOptions<'NewPrinter'>
}

type PrinterForm = {
  type: string
  manufacturer: string
  model: string
  serial: string
  customerId: string | null
  ownership: PrinterOwnership
  address: string
  contact: string
  warranty: string
}

export function NewPrinterModal({ options }: NewPrinterModalProps) {
  const close = useModalsStore((state) => state.close)
  const openModal = useModalsStore((state) => state.open)
  const customers = useCustomersStore((state) => state.customers)
  const company = useCompanyStore((state) => state.company)
  const addPrinter = usePrintersStore((state) => state.addPrinter)

  const [form, setForm] = useState<PrinterForm>({
    type: PRINTER_TYPES[0],
    manufacturer: '',
    model: '',
    serial: '',
    customerId: options.data?.customerId ?? customers[0]?.id ?? null,
    ownership: 'owned',
    address: '',
    contact: '',
    warranty: '',
  })

  const ready = Boolean(
    form.manufacturer.trim() && form.model.trim() && form.customerId,
  )

  const updateField = <Key extends keyof PrinterForm>(key: Key, value: PrinterForm[Key]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleClose = () => {
    close()
  }

  const handleSave = () => {
    if (!ready || !form.customerId) return

    try {
      const printerId = addPrinter({
        type: form.type,
        manufacturer: form.manufacturer.trim(),
        model: form.model.trim(),
        serial: form.serial.trim(),
        customerId: form.customerId,
        ownership: form.ownership,
        address: form.address.trim() || null,
        contact: form.contact.trim() || null,
        warranty: form.warranty || null,
      })
      options.onSaved?.({ printerId })
      close()
    } catch (error) {
      options.onError?.(error)
    }
  }

  return (
    <Modal
      title="Add printer"
      subtitle="Classified as Type → Manufacturer → Model → Serial and linked to a customer."
      onClose={handleClose}
      wide
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleSave()
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Type</span>
          <select
            value={form.type}
            onChange={(event) => updateField('type', event.target.value)}
            className="field-control"
          >
            {PRINTER_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Manufacturer</span>
          <input
            value={form.manufacturer}
            onChange={(event) => updateField('manufacturer', event.target.value)}
            placeholder="e.g. HP"
            className="field-control"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Model</span>
          <input
            value={form.model}
            onChange={(event) => updateField('model', event.target.value)}
            placeholder="e.g. LaserJet M607"
            className="field-control"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Serial number</span>
          <input
            value={form.serial}
            onChange={(event) => updateField('serial', event.target.value)}
            placeholder="SN-..."
            className="field-control font-mono"
          />
        </label>

        <div className="block">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Customer</span>
            <button
              type="button"
              onClick={() =>
                openModal('NewCustomer', {
                  onSaved: ({ customerId }) => updateField('customerId', customerId),
                })
              }
              className="inline-flex cursor-pointer items-center gap-1 text-caption font-bold text-success transition hover:text-ink"
            >
              <AddRoundedIcon sx={{ fontSize: 12 }} aria-hidden="true" />
              New customer
            </button>
          </div>
          <select
            value={form.customerId ?? ''}
            onChange={(event) =>
              updateField('customerId', event.target.value || null)
            }
            className="field-control"
          >
            <option value="" disabled>
              Select customer
            </option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Ownership</span>
          <select
            value={form.ownership}
            onChange={(event) => updateField('ownership', event.target.value as PrinterOwnership)}
            className="field-control"
          >
            <option value="owned">Owned by client</option>
            <option value="rented">Rented</option>
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-ink">
            Address (optional — defaults to company address)
          </span>
          <input
            value={form.address}
            onChange={(event) => updateField('address', event.target.value)}
            placeholder={company.address}
            className="field-control"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">
            Printer user / contact (optional)
          </span>
          <input
            value={form.contact}
            onChange={(event) => updateField('contact', event.target.value)}
            placeholder="Person who uses it"
            className="field-control"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Warranty until (optional)</span>
          <input
            type="date"
            value={form.warranty}
            onChange={(event) => updateField('warranty', event.target.value)}
            className="field-control"
          />
        </label>

        <div className="flex justify-end gap-2 sm:col-span-2">
          <button
            type="button"
            onClick={handleClose}
            className="h-9 cursor-pointer rounded-lg px-3.5 text-sm font-bold text-copy transition hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!ready}
            className="h-9 cursor-pointer rounded-lg bg-brand px-3.5 text-sm font-bold text-surface transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-copy"
          >
            Add printer
          </button>
        </div>
      </form>
    </Modal>
  )
}
