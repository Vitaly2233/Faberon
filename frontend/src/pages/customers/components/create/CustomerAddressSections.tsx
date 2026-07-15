import { FormSection, SelectField, TextField } from './FormControls'
import type { CustomerFormFieldsProps } from './formTypes'

const threeColumnGrid = 'grid gap-4 md:grid-cols-3'
const countries = ['Poland', 'Norway'] as const

export function BillingDetailsSection({ values, onFieldChange }: CustomerFormFieldsProps) {
  return (
    <FormSection title="Billing Details">
      <div className="space-y-3">
        <TextField
          id="billing-address"
          label="Billing address"
          value={values.billingAddress}
          placeholder="123 Luxury Ave, Suite 100"
          onChange={(value) => onFieldChange('billingAddress', value)}
        />
        <div className={threeColumnGrid}>
          <TextField
            id="billing-city"
            label="City"
            value={values.billingCity}
            placeholder="San Francisco"
            onChange={(value) => onFieldChange('billingCity', value)}
          />
          <TextField
            id="billing-region"
            label="State / region"
            value={values.billingRegion}
            placeholder="California"
            onChange={(value) => onFieldChange('billingRegion', value)}
          />
          <TextField
            id="billing-postal-code"
            label="Postal code"
            value={values.billingPostalCode}
            placeholder="94103"
            onChange={(value) => onFieldChange('billingPostalCode', value)}
          />
        </div>
        <div className={threeColumnGrid}>
          <SelectField
            id="billing-country"
            label="Country"
            value={values.billingCountry}
            options={countries}
            onChange={(value) => onFieldChange('billingCountry', value)}
          />
          <SelectField
            id="payment-terms"
            label="Payment terms"
            value={values.paymentTerms}
            options={['Net 30', 'Net 15', 'Net 45', 'Due on receipt'] as const}
            onChange={(value) => onFieldChange('paymentTerms', value)}
          />
          <SelectField
            id="currency"
            label="Currency"
            value={values.currency}
            options={['USD ($)', 'EUR (€)', 'PLN (zł)', 'NOK (kr)'] as const}
            onChange={(value) => onFieldChange('currency', value)}
          />
        </div>
      </div>
    </FormSection>
  )
}
