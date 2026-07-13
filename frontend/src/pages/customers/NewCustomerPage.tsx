import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NewCustomerForm } from './components/create/NewCustomerForm'
import type { NewCustomerField, NewCustomerFormStep, NewCustomerFormValues } from './types'

const initialValues: NewCustomerFormValues = {
  customerType: 'Company',
  customerName: '',
  legalCompanyName: '',
  taxNumber: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  jobTitle: '',
  billingAddress: '',
  billingCity: '',
  billingRegion: '',
  billingPostalCode: '',
  billingCountry: 'United States',
  paymentTerms: 'Net 30',
  currency: 'USD ($)',
  locationName: '',
  locationAddress: '',
  locationCity: '',
  locationRegion: '',
  locationPostalCode: '',
  locationCountry: 'United States',
  locationContactName: '',
  locationPhone: '',
  locationEmail: '',
  portalEnabled: true,
  sendInvitation: true,
  internalNotes: '',
}

export function NewCustomerPage() {
  const navigate = useNavigate()
  const pageTopRef = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState(initialValues)
  const [currentStep, setCurrentStep] = useState<NewCustomerFormStep>(0)

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

  return (
    <div ref={pageTopRef} className="min-h-full bg-canvas p-3 sm:p-5">
      <NewCustomerForm
        values={values}
        currentStep={currentStep}
        onFieldChange={handleFieldChange}
        onExit={returnToCustomers}
        onBack={handleBack}
        onContinue={handleContinue}
        onCreate={returnToCustomers}
      />
    </div>
  )
}
