import type { CustomerDetail } from '../../types'

type CompanyInformationProps = {
  customer: CustomerDetail
}

export function CompanyInformation({ customer }: CompanyInformationProps) {
  const fields = [
    ['Legal name', customer.legalName],
    ['Tax ID', customer.taxId],
    ['Billing address', customer.billingAddress],
    ['Phone', customer.phone],
    ['Email', customer.contactEmail],
    ['Website', customer.website],
  ]

  return (
    <section className="rounded-xl border border-line bg-surface p-4 shadow-field">
      <h2 className="text-sm font-semibold text-ink">Company information</h2>
      <dl className="mt-3 space-y-3">
        {fields.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[7rem_1fr] gap-3 text-xs">
            <dt className="text-copy">{label}</dt>
            <dd className="font-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
