import { FormSection } from './FormControls'
import type { CustomerFormFieldsProps } from './formTypes'

export function PortalAccessSection({ values, onFieldChange }: CustomerFormFieldsProps) {
  return (
    <FormSection title="Customer Portal">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-ink">Enable Customer Portal</p>
          <p className="mt-1 text-xs text-copy">
            Allows the customer to view work orders and invoices online.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={values.portalEnabled}
          onClick={() => onFieldChange('portalEnabled', !values.portalEnabled)}
          className={`relative mt-1 h-6 w-11 shrink-0 cursor-pointer rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
            values.portalEnabled ? 'bg-ink' : 'bg-line'
          }`}
        >
          <span
            className={`absolute top-1 size-4 rounded-full bg-surface shadow-field transition ${
              values.portalEnabled ? 'left-6' : 'left-1'
            }`}
          />
          <span className="sr-only">Enable customer portal</span>
        </button>
      </div>
    </FormSection>
  )
}

export function InvitationSettingsSection({ values, onFieldChange }: CustomerFormFieldsProps) {
  return (
    <FormSection title="Invitation Settings">
      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-canvas p-4 text-sm text-ink transition hover:border-brand">
        <input
          type="checkbox"
          checked={values.sendInvitation}
          onChange={(event) => onFieldChange('sendInvitation', event.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded accent-ink"
        />
        <span>
          <span className="block font-semibold">Send invitation email immediately</span>
          <span className="mt-1 block text-xs text-copy">
            The main contact will receive instructions to activate their portal account.
          </span>
        </span>
      </label>
    </FormSection>
  )
}

export function InternalNotesSection({ values, onFieldChange }: CustomerFormFieldsProps) {
  return (
    <FormSection title="Internal Notes">
      <label htmlFor="internal-notes" className="block text-xs font-semibold uppercase tracking-wide text-copy">
        Notes
        <textarea
          id="internal-notes"
          value={values.internalNotes}
          placeholder="Add internal-only notes about this customer..."
          onChange={(event) => onFieldChange('internalNotes', event.target.value)}
          className="mt-1 min-h-28 w-full resize-y rounded-lg border border-line bg-canvas p-3 text-sm normal-case tracking-normal text-ink shadow-field outline-none transition placeholder:text-copy/70 focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
      </label>
    </FormSection>
  )
}
