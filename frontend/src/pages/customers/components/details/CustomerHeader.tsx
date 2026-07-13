import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import type { CustomerDetail } from '../../types'

type CustomerHeaderProps = {
  customer: CustomerDetail
  onBack: () => void
  onEdit: () => void
  onTabSelect: (tab: string) => void
}

const tabs = [
  'Overview',
  'Locations',
  'Products',
  'Repair requests',
  'Work orders',
  'Maintenance plans',
  'Contacts',
  'Portal users',
  'Documents',
  'Meter readings',
  'Invoices',
  'Attachments',
]

export function CustomerHeader({
  customer,
  onBack,
  onEdit,
  onTabSelect,
}: CustomerHeaderProps) {
  return (
    <header>
      <div className="flex items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1 text-xs text-copy" aria-label="Breadcrumb">
            <button
              type="button"
              onClick={onBack}
              className="cursor-pointer transition hover:text-brand-strong focus-visible:outline-2 focus-visible:outline-brand"
            >
              Customers
            </button>
            <ChevronRightRoundedIcon fontSize="small" aria-hidden="true" />
            <span>{customer.name}</span>
          </nav>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink">{customer.name}</h1>
            <span className="rounded-full bg-brand-soft px-2 py-1 text-xs font-semibold uppercase text-brand-strong">
              {customer.status}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-copy">
            <span>Type: {customer.category}</span>
            <span>Main contact: {customer.contactName}</span>
            <span>Account ID: {customer.accountId}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="flex h-9 cursor-pointer items-center gap-1 rounded-lg border border-line bg-surface px-3 text-xs font-semibold text-ink transition hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <EditOutlinedIcon fontSize="small" aria-hidden="true" />
          Edit
        </button>
      </div>
      <nav className="mt-5 flex gap-5 overflow-x-auto border-b border-line" aria-label="Customer sections">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabSelect(tab)}
            className={`shrink-0 cursor-pointer border-b-2 pb-2 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-brand ${
              tab === 'Overview'
                ? 'border-brand text-brand-strong'
                : 'border-transparent text-copy hover:text-ink'
            }`}
            aria-current={tab === 'Overview' ? 'page' : undefined}
          >
            {tab}
          </button>
        ))}
      </nav>
    </header>
  )
}
