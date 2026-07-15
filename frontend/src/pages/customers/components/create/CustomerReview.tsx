import type { ReactNode } from 'react'
import type { NewCustomerFormValues } from '../../types'
import { FormSection } from './FormControls'

type CustomerReviewProps = {
  values: NewCustomerFormValues
}

type SummaryGroupProps = {
  title: string
  children: ReactNode
}

function SummaryGroup({ title, children }: SummaryGroupProps) {
  return (
    <section className="rounded-lg border border-line bg-canvas p-4">
      <h3 className="text-xs font-bold uppercase tracking-wide text-copy">{title}</h3>
      <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">{children}</dl>
    </section>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-copy">{label}</dt>
      <dd className="mt-0.5 break-words text-sm font-medium text-ink">{value || 'Not provided'}</dd>
    </div>
  )
}

function formatAddress(...parts: string[]) {
  return parts.filter(Boolean).join(', ')
}

export function CustomerReview({ values }: CustomerReviewProps) {
  return (
    <FormSection title="Final Summary">
      <p className="mb-4 text-sm text-copy">
        Review the customer information below before creating the account.
      </p>
      <div className="grid gap-3 lg:grid-cols-2">
        <SummaryGroup title="Customer">
          <SummaryItem label="Customer type" value={values.customerType} />
          <SummaryItem label="Customer name" value={values.customerName} />
          <SummaryItem label="Legal company name" value={values.legalCompanyName} />
          <SummaryItem label="Tax / VAT number" value={values.taxNumber} />
          <SummaryItem label="Main contact" value={values.contactName} />
          <SummaryItem label="Contact email" value={values.contactEmail} />
        </SummaryGroup>
        <SummaryGroup title="Billing">
          <SummaryItem
            label="Billing address"
            value={formatAddress(
              values.billingAddress,
              values.billingCity,
              values.billingRegion,
              values.billingPostalCode,
              values.billingCountry,
            )}
          />
          <SummaryItem label="Payment" value={`${values.paymentTerms} · ${values.currency}`} />
        </SummaryGroup>
        <SummaryGroup title="Notes">
          <div className="sm:col-span-2">
            <SummaryItem label="Internal notes" value={values.internalNotes} />
          </div>
        </SummaryGroup>
      </div>
    </FormSection>
  )
}
