import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import type { NewCustomerFormStep } from '../../types'

type CustomerFormStepperProps = {
  currentStep: NewCustomerFormStep
}

const steps = [
  { title: 'Customer details', description: 'Company and contact' },
  { title: 'Billing', description: 'Billing address and terms' },
  { title: 'Notes and review', description: 'Notes and final summary' },
] as const

export function CustomerFormStepper({ currentStep }: CustomerFormStepperProps) {
  return (
    <nav
      className="mt-5 rounded-xl border border-line bg-surface px-4 py-5 shadow-field sm:px-6"
      aria-label="Customer creation progress"
    >
      <ol className="grid grid-cols-3">
        {steps.map((step, index) => {
          const isComplete = index < currentStep
          const isCurrent = index === currentStep

          return (
            <li
              key={step.title}
              className="relative min-w-0 text-center"
              aria-current={isCurrent ? 'step' : undefined}
            >
              {index < steps.length - 1 && (
                <span
                  className={`absolute left-1/2 top-4 h-0.5 w-full ${index < currentStep ? 'bg-brand' : 'bg-line'}`}
                  aria-hidden="true"
                />
              )}
              <div className="relative">
                <span
                  className={`mx-auto flex size-8 items-center justify-center rounded-full border text-xs font-bold transition ${
                    isComplete || isCurrent
                      ? 'border-brand bg-brand text-surface'
                      : 'border-line bg-surface text-copy'
                  }`}
                >
                  {isComplete ? (
                    <CheckRoundedIcon fontSize="small" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={`mt-2 block truncate text-xs font-semibold ${isCurrent ? 'text-ink' : 'text-copy'}`}
                >
                  {step.title}
                </span>
                <span className="mt-0.5 hidden truncate text-xs text-copy sm:block">
                  {step.description}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
