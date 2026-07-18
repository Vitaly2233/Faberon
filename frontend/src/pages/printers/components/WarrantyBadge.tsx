import { StatusBadge } from '../../work-orders/components/StatusBadge'

type WarrantyBadgeProps = {
  warranty: string | null
}

export function WarrantyBadge({ warranty }: WarrantyBadgeProps) {
  if (!warranty) {
    return <StatusBadge tone="inactive">None</StatusBadge>
  }

  const active = new Date(warranty) > new Date()

  return (
    <StatusBadge tone={active ? 'success' : 'danger'}>
      {active ? 'Under warranty' : 'Expired'}
    </StatusBadge>
  )
}
