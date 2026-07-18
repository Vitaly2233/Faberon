import { useState } from 'react'
import { useCompanyStore } from '../../../store/companyStore'
import { useCustomersStore } from '../../../store/customersStore'
import { useWorkOrdersStore } from '../../../store/workOrdersStore'
import type { WorkOrderType } from '../../../store/workOrderTypes'
import { Field } from './FormField'
import { fieldClassName } from './fieldStyles'
import { Modal } from '../../../components/Modal'

type CreateWorkOrderModalProps = {
  onClose: () => void
}

export function CreateWorkOrderModal({ onClose }: CreateWorkOrderModalProps) {
  const customers = useCustomersStore((state) => state.customers)
  const printers = useWorkOrdersStore((state) => state.printers)
  const createWorkOrder = useWorkOrdersStore((state) => state.createWorkOrder)
  const company = useCompanyStore((state) => state.company)

  const [form, setForm] = useState({
    type: 'company' as WorkOrderType,
    customerId: customers[0]?.id ?? '',
    printerId: '',
    address: '',
    contact: '',
    problem: '',
  })

  const customer = customers.find((entry) => entry.id === form.customerId)
  const customerPrinters = printers.filter((printer) => printer.customerId === form.customerId)
  const ready = Boolean(form.customerId && form.problem.trim())

  const updateField = <Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <Modal
      title="Create work order"
      subtitle="A number is assigned automatically. Address and contact fall back to defaults if left blank."
      onClose={onClose}
      wide
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (!ready) return
          createWorkOrder({
            type: form.type,
            customerId: form.customerId,
            printerId: form.printerId || null,
            address: form.address || customer?.billingAddress || company.address,
            contact:
              form.contact ||
              `${customer?.contactName ?? ''} · ${customer?.phone ?? ''}`.replace(/^ · | · $/g, ''),
            problem: form.problem.trim(),
            invoiceFinalOnly: false,
          })
          onClose()
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Field label="Type">
          <select
            value={form.type}
            onChange={(event) => updateField('type', event.target.value as WorkOrderType)}
            className={fieldClassName}
          >
            <option value="company">Company (internal)</option>
            <option value="client-requested">Client requested</option>
          </select>
        </Field>
        <Field label="Customer">
          <select
            value={form.customerId}
            onChange={(event) => {
              updateField('customerId', event.target.value)
              updateField('printerId', '')
            }}
            className={fieldClassName}
          >
            {customers.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Printer (optional)">
          <select
            value={form.printerId}
            onChange={(event) => updateField('printerId', event.target.value)}
            className={fieldClassName}
          >
            <option value="">No printer</option>
            {customerPrinters.map((printer) => (
              <option key={printer.id} value={printer.id}>
                {printer.manufacturer} {printer.model} · {printer.serial}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Contact (optional)">
          <input
            value={form.contact}
            onChange={(event) => updateField('contact', event.target.value)}
            placeholder={
              customer ? `${customer.contactName} · ${customer.phone}` : 'Default contact'
            }
            className={fieldClassName}
          />
        </Field>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Address (optional)</span>
          <input
            value={form.address}
            onChange={(event) => updateField('address', event.target.value)}
            placeholder={customer?.billingAddress || company.address}
            className={fieldClassName}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Problem description</span>
          <textarea
            value={form.problem}
            onChange={(event) => updateField('problem', event.target.value)}
            rows={3}
            placeholder="Describe the issue reported..."
            className={`${fieldClassName} h-auto py-2.5`}
          />
        </label>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 cursor-pointer rounded-lg px-3.5 text-sm font-bold text-copy transition hover:bg-canvas hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!ready}
            className="h-9 cursor-pointer rounded-lg bg-brand px-3.5 text-sm font-bold text-surface transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:bg-line disabled:text-copy"
          >
            Create work order
          </button>
        </div>
      </form>
    </Modal>
  )
}
