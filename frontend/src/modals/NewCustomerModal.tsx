import { useState } from 'react'
import { Modal } from '../components/Modal'
import { useCustomersStore, type NewCustomerInput } from '../store/customersStore'
import { useModalsStore, type ModalOptions } from '../store/modals'

type NewCustomerModalProps = {
  options: ModalOptions<'NewCustomer'>
}

const emptyForm: NewCustomerInput = {
  name: '',
  contactPerson: '',
  contactPhone: '',
  email: '',
  address: '',
}

export function NewCustomerModal({ options }: NewCustomerModalProps) {
  const close = useModalsStore((state) => state.close)
  const addCustomer = useCustomersStore((state) => state.addCustomer)
  const [form, setForm] = useState<NewCustomerInput>({
    ...emptyForm,
    name: options.data?.initialName ?? '',
  })

  const updateField = (field: keyof NewCustomerInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleClose = () => {
    close()
  }

  const handleSave = () => {
    try {
      const customerId = addCustomer(form)
      options.onSaved?.({ customerId })
      close()
    } catch (error) {
      options.onError?.(error)
    }
  }

  return (
    <Modal
      title="Add customer"
      subtitle="A customer contact can be reached by the company when needed."
      onClose={handleClose}
      wide
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (!form.name.trim()) return
          handleSave()
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Customer name</span>
          <input
            autoFocus
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="e.g. Grand Hotel"
            className="field-control"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Contact person</span>
          <input
            value={form.contactPerson}
            onChange={(event) => updateField('contactPerson', event.target.value)}
            placeholder="Full name"
            className="field-control"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Contact phone</span>
          <input
            value={form.contactPhone}
            onChange={(event) => updateField('contactPhone', event.target.value)}
            placeholder="+1 (555) 000-0000"
            className="field-control"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="name@company.com"
            className="field-control"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Address</span>
          <input
            value={form.address}
            onChange={(event) => updateField('address', event.target.value)}
            placeholder="Street, city, state"
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
            disabled={!form.name.trim()}
            className="h-9 cursor-pointer rounded-lg bg-brand px-3.5 text-sm font-bold text-surface transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-copy"
          >
            Add customer
          </button>
        </div>
      </form>
    </Modal>
  )
}
