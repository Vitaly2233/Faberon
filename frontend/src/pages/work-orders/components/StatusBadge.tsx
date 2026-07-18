import type { ReactNode } from 'react'
import type { WorkOrderStage } from '../../../store/workOrderTypes'
import { stageTone } from '../../../store/workOrderTypes'

type Tone = 'success' | 'info' | 'warning' | 'inactive' | 'danger'

const toneClass: Record<Tone, string> = {
  success: 'bg-success-soft text-success',
  info: 'bg-info-soft text-info',
  warning: 'bg-warning-soft text-warning',
  inactive: 'bg-inactive-soft text-inactive',
  danger: 'bg-danger-soft text-danger',
}

type StatusBadgeProps = {
  children: ReactNode
  tone?: Tone
}

export function StatusBadge({ children, tone = 'inactive' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-2xs font-extrabold uppercase tracking-wide ${toneClass[tone]}`}
    >
      {children}
    </span>
  )
}

export function StageBadge({ stage }: { stage: WorkOrderStage }) {
  return <StatusBadge tone={stageTone(stage)}>{stage}</StatusBadge>
}
