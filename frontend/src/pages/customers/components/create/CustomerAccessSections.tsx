import { FormSection } from './FormControls'
import type { CustomerFormFieldsProps } from './formTypes'

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
