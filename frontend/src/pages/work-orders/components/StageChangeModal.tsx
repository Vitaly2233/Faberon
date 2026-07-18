import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { useState } from 'react'
import type { WorkOrderStage } from '../../../store/workOrderTypes'
import { Field } from './FormField'
import { fieldClassName } from './fieldStyles'
import { Modal } from '../../../components/Modal'
import { StageBadge } from './StatusBadge'

type StageChangeModalProps = {
  from: WorkOrderStage
  target: WorkOrderStage
  direction: 'forward' | 'back'
  onClose: () => void
  onConfirm: (note: string) => void
}

export function StageChangeModal({
  from,
  target,
  direction,
  onClose,
  onConfirm,
}: StageChangeModalProps) {
  const [note, setNote] = useState('')
  const isRepaired = target === 'Repaired'

  return (
    <Modal
      title={isRepaired ? 'Mark as repaired?' : 'Update stage'}
      subtitle="The client is notified with your comment and can follow the change."
      onClose={onClose}
    >
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-line bg-canvas p-3">
        <StageBadge stage={from} />
        {direction === 'forward' ? (
          <ArrowForwardRoundedIcon fontSize="small" className="text-copy" aria-hidden="true" />
        ) : (
          <ArrowBackRoundedIcon fontSize="small" className="text-copy" aria-hidden="true" />
        )}
        <StageBadge stage={target} />
      </div>

      {isRepaired && (
        <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning-soft p-3 text-xs leading-relaxed text-warning">
          <WarningAmberRoundedIcon fontSize="small" className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            Are you sure the repair is complete? This sends the client a request to confirm, and they
            will be able to approve the work order.
          </span>
        </div>
      )}

      <Field label={`Comment ${direction === 'back' ? '(recommended)' : '(optional)'}`}>
        <textarea
          autoFocus
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          placeholder={
            direction === 'back'
              ? 'Why is this moving back a step?'
              : 'Add context for the client...'
          }
          className={`${fieldClassName} h-auto py-2.5`}
        />
      </Field>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="h-9 cursor-pointer rounded-lg px-3.5 text-sm font-bold text-copy transition hover:bg-canvas hover:text-ink"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onConfirm(note)}
          className="h-9 cursor-pointer rounded-lg bg-brand px-3.5 text-sm font-bold text-surface transition hover:bg-brand-strong"
        >
          {isRepaired
            ? 'Yes, mark as repaired'
            : direction === 'forward'
              ? 'Advance stage'
              : 'Move back'}
        </button>
      </div>
    </Modal>
  )
}
