import type { PrinterOwnership } from '../../../store/types/printer'
import { StatusBadge } from '../../work-orders/components/StatusBadge'

type OwnershipBadgeProps = {
  ownership: PrinterOwnership
}

export function OwnershipBadge({ ownership }: OwnershipBadgeProps) {
  return (
    <StatusBadge tone={ownership === 'owned' ? 'inactive' : 'info'}>
      {ownership === 'owned' ? 'Owned' : 'Rented'}
    </StatusBadge>
  )
}
