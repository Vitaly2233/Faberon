import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCustomer } from './api/customerApi'
import { NewCustomerForm } from './components/create/NewCustomerForm'
import { initialNewCustomerValues } from './data/newCustomerForm'
import type { NewCustomerField, NewCustomerFormStep, NewCustomerFormValues } from './types'

export function NewCustomerPage() {
  const navigate = useNavigate()
  const pageTopRef = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState(initialNewCustomerValues)
  const [currentStep, setCurrentStep] = useState<NewCustomerFormStep>(0)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const handleFieldChange = <Field extends NewCustomerField>(
    field: Field,
    value: NewCustomerFormValues[Field],
  ) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }))
  }

  const returnToCustomers = () => navigate('/customers')

  const showStep = (step: NewCustomerFormStep) => {
    setCurrentStep(step)
    pageTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleBack = () => {
    if (currentStep === 0) {
      returnToCustomers()
      return
    }

    showStep((currentStep - 1) as NewCustomerFormStep)
  }

  const handleContinue = () => {
    if (currentStep < 2) {
      showStep((currentStep + 1) as NewCustomerFormStep)
    }
  }

  const handleCreate = async () => {
    setIsCreating(true)
    setCreateError(null)

    try {
      await createCustomer(values)
      returnToCustomers()
    } catch {
      setCreateError('Could not create the customer. Check the information and try again.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div ref={pageTopRef} className="min-h-full bg-canvas p-3 sm:p-5">
      <NewCustomerForm
        values={values}
        currentStep={currentStep}
        onFieldChange={handleFieldChange}
        onExit={returnToCustomers}
        onBack={handleBack}
        onContinue={handleContinue}
        onCreate={handleCreate}
        isCreating={isCreating}
        createError={createError}
      />
    </div>
  )
}
