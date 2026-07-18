import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useState } from 'react'
import type { NewCustomerInput } from '../../../store/customersStore'

type AddCustomerModalProps = {
  onClose: () => void
  onSave: (customer: NewCustomerInput) => void
}

const emptyForm: NewCustomerInput = {
  name: '',
  contactPerson: '',
  contactPhone: '',
  email: '',
  address: '',
}

const fieldClassName = 'field-control'

export function AddCustomerModal({ onClose, onSave }: AddCustomerModalProps) {
  const [form, setForm] = useState(emptyForm)

  const updateField = (field: keyof NewCustomerInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-customer-title"
        onClick={(event) => event.stopPropagation()}
        className="my-10 w-full max-w-modal rounded-xl border border-line bg-surface p-5 shadow-card sm:max-w-modal-wide"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="add-customer-title" className="text-base font-extrabold tracking-tight text-ink">
              Add customer
            </h2>
            <p className="mt-1 text-xs text-copy">
              A customer contact can be reached by the company when needed.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-copy transition hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            aria-label="Close"
          >
            <CloseRoundedIcon fontSize="small" />
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!form.name.trim()) return
            onSave(form)
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
              className={fieldClassName}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink">Contact person</span>
            <input
              value={form.contactPerson}
              onChange={(event) => updateField('contactPerson', event.target.value)}
              placeholder="Full name"
              className={fieldClassName}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink">Contact phone</span>
            <input
              value={form.contactPhone}
              onChange={(event) => updateField('contactPhone', event.target.value)}
              placeholder="+1 (555) 000-0000"
              className={fieldClassName}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="name@company.com"
              className={fieldClassName}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink">Address</span>
            <input
              value={form.address}
              onChange={(event) => updateField('address', event.target.value)}
              placeholder="Street, city, state"
              className={fieldClassName}
            />
          </label>

          <div className="flex justify-end gap-2 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
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
      </div>
    </div>
  )
}
