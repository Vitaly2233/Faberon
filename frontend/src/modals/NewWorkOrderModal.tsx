import { useState } from 'react'
import { Modal } from '../components/Modal'
import { useCompanyStore } from '../store/companyStore'
import { useCustomersStore } from '../store/customersStore'
import { useModalsStore, type ModalOptions } from '../store/modals'
import { usePrintersStore } from '../store/printersStore'
import { useWorkOrdersStore } from '../store/workOrdersStore'
import type { WorkOrderType } from '../store/types/work-order'

type NewWorkOrderModalProps = {
  options: ModalOptions<'NewWorkOrder'>
}

export function NewWorkOrderModal({ options }: NewWorkOrderModalProps) {
  const close = useModalsStore((state) => state.close)
  const customers = useCustomersStore((state) => state.customers)
  const printers = usePrintersStore((state) => state.printers)
  const createWorkOrder = useWorkOrdersStore((state) => state.createWorkOrder)
  const company = useCompanyStore((state) => state.company)

  const [form, setForm] = useState<{
    type: WorkOrderType
    customerId: string | null
    printerId: string | null
    address: string
    contact: string
    problem: string
  }>({
    type: 'company',
    customerId: options.data?.customerId ?? customers[0]?.id ?? null,
    printerId: null,
    address: '',
    contact: '',
    problem: '',
  })

  const customer = form.customerId
    ? customers.find((entry) => entry.id === form.customerId)
    : undefined
  const customerPrinters = form.customerId
    ? printers.filter((printer) => printer.customerId === form.customerId)
    : []
  const ready = Boolean(form.customerId && form.problem.trim())

  const updateField = <Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleClose = () => {
    close()
  }

  const handleCreate = () => {
    if (!ready || !form.customerId) return

    try {
      const selectedCustomer = customers.find((entry) => entry.id === form.customerId)
      if (!selectedCustomer) {
        throw new Error('Selected customer was not found.')
      }

      const defaultContact = [selectedCustomer.contactName, selectedCustomer.phone]
        .filter((part) => Boolean(part))
        .join(' · ')

      const workOrderId = createWorkOrder({
        type: form.type,
        customerId: form.customerId,
        printerId: form.printerId,
        address:
          form.address.trim() || selectedCustomer.billingAddress || company.address,
        contact: form.contact.trim() || defaultContact,
        problem: form.problem.trim(),
        invoiceFinalOnly: false,
      })
      options.onCreated?.({ workOrderId })
      close()
    } catch (error) {
      options.onError?.(error)
    }
  }

  return (
    <Modal
      title="Create work order"
      subtitle="A number is assigned automatically. Address and contact fall back to defaults if left blank."
      onClose={handleClose}
      wide
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleCreate()
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Type</span>
          <select
            value={form.type}
            onChange={(event) => updateField('type', event.target.value as WorkOrderType)}
            className="field-control"
          >
            <option value="company">Company (internal)</option>
            <option value="client-requested">Client requested</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Customer</span>
          <select
            value={form.customerId ?? ''}
            onChange={(event) => {
              updateField('customerId', event.target.value || null)
              updateField('printerId', null)
            }}
            className="field-control"
          >
            <option value="" disabled>
              Select customer
            </option>
            {customers.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Printer (optional)</span>
          <select
            value={form.printerId ?? ''}
            onChange={(event) => updateField('printerId', event.target.value || null)}
            className="field-control"
          >
            <option value="">No printer</option>
            {customerPrinters.map((printer) => (
              <option key={printer.id} value={printer.id}>
                {printer.manufacturer} {printer.model} · {printer.serial}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Contact (optional)</span>
          <input
            value={form.contact}
            onChange={(event) => updateField('contact', event.target.value)}
            placeholder={
              customer ? `${customer.contactName} · ${customer.phone}` : 'Default contact'
            }
            className="field-control"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Address (optional)</span>
          <input
            value={form.address}
            onChange={(event) => updateField('address', event.target.value)}
            placeholder={customer?.billingAddress || company.address}
            className="field-control"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Problem description</span>
          <textarea
            value={form.problem}
            onChange={(event) => updateField('problem', event.target.value)}
            rows={3}
            placeholder="Describe the issue reported..."
            className="field-control h-auto py-2.5"
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
            Create work order
          </button>
        </div>
      </form>
    </Modal>
  )
}
