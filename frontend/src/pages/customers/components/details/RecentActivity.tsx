import type { ElementType } from 'react'
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined'

type RecentActivityProps = {
  onViewAll: () => void
}

const activities: Array<{ icon: ElementType; title: string; detail: string }> = [
  { icon: BuildCircleOutlinedIcon, title: 'Repair request #482', detail: 'Open · Front desk ice machine' },
  { icon: SpeedOutlinedIcon, title: 'Meter reading', detail: 'Generator 1 fuel level updated' },
  { icon: HandymanOutlinedIcon, title: 'Maintenance completed', detail: 'HVAC seasonal service · Unit A' },
  { icon: ReceiptLongOutlinedIcon, title: 'Invoice sent', detail: 'INV-2026-021 · $1,450.00' },
  { icon: DescriptionOutlinedIcon, title: 'Document uploaded', detail: 'East lobby safety certificate' },
]

export function RecentActivity({ onViewAll }: RecentActivityProps) {
  return (
    <section className="rounded-xl border border-line bg-surface p-4 shadow-field">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Recent activity</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="cursor-pointer text-xs font-medium text-brand-strong hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
        >
          View all
        </button>
      </div>
      <div className="mt-3 divide-y divide-line">
        {activities.map(({ icon: Icon, title, detail }) => (
          <div key={title} className="flex gap-3 py-3 first:pt-0 last:pb-0">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-copy">
              <Icon fontSize="small" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold text-ink">{title}</p>
              <p className="mt-1 text-xs text-copy">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
