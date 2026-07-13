import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import type { NewCustomerField, NewCustomerFormStep, NewCustomerFormValues } from '../../types'
import {
  InternalNotesSection,
  InvitationSettingsSection,
  PortalAccessSection,
} from './CustomerAccessSections'
import { BillingDetailsSection, PrimaryLocationSection } from './CustomerAddressSections'
import { CustomerFormStepper } from './CustomerFormStepper'
import { GeneralInformationSection, MainContactSection } from './CustomerInformationSections'
import { CustomerReview } from './CustomerReview'

type NewCustomerFormProps = {
  values: NewCustomerFormValues
  currentStep: NewCustomerFormStep
  onFieldChange: <Field extends NewCustomerField>(
    field: Field,
    value: NewCustomerFormValues[Field],
  ) => void
  onExit: () => void
  onBack: () => void
  onContinue: () => void
  onCreate: () => void
}

const stepContent = [
  {
    title: 'Customer details',
    description: 'Tell us about the customer and their main point of contact.',
  },
  {
    title: 'Billing and location',
    description: 'Set billing preferences and the customer’s primary service location.',
  },
  {
    title: 'Access and review',
    description: 'Configure portal access and confirm the information before creation.',
  },
] as const

export function NewCustomerForm({
  values,
  currentStep,
  onFieldChange,
  onExit,
  onBack,
  onContinue,
  onCreate,
}: NewCustomerFormProps) {
  const fields = { values, onFieldChange }
  const isFinalStep = currentStep === 2

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (isFinalStep) {
          onCreate()
        } else {
          onContinue()
        }
      }}
    >
      <header>
        <nav className="flex items-center gap-1 text-xs text-copy" aria-label="Breadcrumb">
          <button
            type="button"
            onClick={onExit}
            className="cursor-pointer transition hover:text-brand-strong focus-visible:outline-2 focus-visible:outline-brand"
          >
            Customers
          </button>
          <ChevronRightRoundedIcon fontSize="small" aria-hidden="true" />
          <span className="font-medium text-ink">New Customer</span>
        </nav>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">New Customer</h1>
      </header>

      <CustomerFormStepper currentStep={currentStep} />

      <div className="mt-4 rounded-xl border border-line bg-surface p-4 shadow-field sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-strong">
            Step {currentStep + 1} of 3
          </p>
          <h2 className="mt-1 text-xl font-bold text-ink">{stepContent[currentStep].title}</h2>
          <p className="mt-1 text-sm text-copy">{stepContent[currentStep].description}</p>
        </div>

        <div className="space-y-6">
          {currentStep === 0 && (
            <>
              <GeneralInformationSection {...fields} />
              <MainContactSection {...fields} />
            </>
          )}
          {currentStep === 1 && (
            <>
              <BillingDetailsSection {...fields} />
              <PrimaryLocationSection {...fields} />
            </>
          )}
          {currentStep === 2 && (
            <>
              <PortalAccessSection {...fields} />
              <InvitationSettingsSection {...fields} />
              <InternalNotesSection {...fields} />
              <CustomerReview values={values} />
            </>
          )}
        </div>

        <footer className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
          <button
            type="button"
            onClick={onBack}
            className="h-10 cursor-pointer rounded-lg border border-line bg-surface px-5 text-xs font-semibold text-ink transition hover:border-copy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Back
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-copy sm:inline">Step {currentStep + 1} of 3</span>
            <button
              type="submit"
              className="h-10 min-w-28 cursor-pointer rounded-lg bg-ink px-5 text-xs font-semibold text-surface shadow-field transition hover:bg-hero-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {isFinalStep ? 'Create Customer' : 'Continue'}
            </button>
          </div>
        </footer>
      </div>
    </form>
  )
}
