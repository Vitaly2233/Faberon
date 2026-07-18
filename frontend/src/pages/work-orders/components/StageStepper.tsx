import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { WORK_ORDER_STAGES, type WorkOrderStage } from '../../../store/workOrderTypes'

type StageStepperProps = {
  stage: WorkOrderStage
}

export function StageStepper({ stage }: StageStepperProps) {
  const current = WORK_ORDER_STAGES.indexOf(stage)

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {WORK_ORDER_STAGES.map((label, index) => {
        const done = index < current
        const active = index === current

        return (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-bold ${
                active
                  ? 'bg-brand text-surface'
                  : done
                    ? 'bg-success-soft text-success'
                    : 'bg-canvas text-copy'
              }`}
            >
              <span
                className={`flex size-3.5 items-center justify-center rounded-full text-micro ${
                  active
                    ? 'bg-surface text-ink'
                    : done
                      ? 'bg-success text-surface'
                      : 'bg-line text-copy'
                }`}
              >
                {index + 1}
              </span>
              {label}
            </span>
            {index < WORK_ORDER_STAGES.length - 1 && (
              <ChevronRightRoundedIcon fontSize="small" className="text-line" aria-hidden="true" />
            )}
          </div>
        )
      })}
    </div>
  )
}
