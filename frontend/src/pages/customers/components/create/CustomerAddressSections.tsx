import { FormSection, SelectField, TextField } from './FormControls'
import type { CustomerFormFieldsProps } from './formTypes'

const twoColumnGrid = 'grid gap-4 md:grid-cols-2'
const threeColumnGrid = 'grid gap-4 md:grid-cols-3'
const countries = ['United States', 'Canada', 'United Kingdom', 'Poland']

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
            options={['Net 30', 'Net 15', 'Net 45', 'Due on receipt']}
            onChange={(value) => onFieldChange('paymentTerms', value)}
          />
          <SelectField
            id="currency"
            label="Currency"
            value={values.currency}
            options={['USD ($)', 'EUR (€)', 'GBP (£)', 'PLN (zł)']}
            onChange={(value) => onFieldChange('currency', value)}
          />
        </div>
      </div>
    </FormSection>
  )
}

export function PrimaryLocationSection({ values, onFieldChange }: CustomerFormFieldsProps) {
  return (
    <FormSection title="Primary Location">
      <div className="space-y-3">
        <TextField
          id="location-name"
          label="Location name"
          value={values.locationName}
          placeholder="Main Branch"
          onChange={(value) => onFieldChange('locationName', value)}
        />
        <TextField
          id="location-address"
          label="Address"
          value={values.locationAddress}
          placeholder="123 Luxury Ave, San Francisco, CA"
          onChange={(value) => onFieldChange('locationAddress', value)}
        />
        <div className={threeColumnGrid}>
          <TextField
            id="location-city"
            label="City"
            value={values.locationCity}
            placeholder="San Francisco"
            onChange={(value) => onFieldChange('locationCity', value)}
          />
          <TextField
            id="location-region"
            label="State"
            value={values.locationRegion}
            placeholder="CA"
            onChange={(value) => onFieldChange('locationRegion', value)}
          />
          <TextField
            id="location-postal-code"
            label="Postal code"
            value={values.locationPostalCode}
            placeholder="94103"
            onChange={(value) => onFieldChange('locationPostalCode', value)}
          />
        </div>
        <div className={twoColumnGrid}>
          <SelectField
            id="location-country"
            label="Country"
            value={values.locationCountry}
            options={countries}
            onChange={(value) => onFieldChange('locationCountry', value)}
          />
          <TextField
            id="location-contact-name"
            label="Location contact name"
            value={values.locationContactName}
            placeholder="Sarah Smith"
            onChange={(value) => onFieldChange('locationContactName', value)}
          />
          <TextField
            id="location-phone"
            label="Location phone"
            value={values.locationPhone}
            placeholder="+1 (555) 111-2222"
            type="tel"
            onChange={(value) => onFieldChange('locationPhone', value)}
          />
          <TextField
            id="location-email"
            label="Location email"
            value={values.locationEmail}
            placeholder="s.smith@grandhotel.com"
            type="email"
            onChange={(value) => onFieldChange('locationEmail', value)}
          />
        </div>
      </div>
    </FormSection>
  )
}
