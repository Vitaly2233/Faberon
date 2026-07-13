import { FormSection, SelectField, TextField } from './FormControls'
import type { CustomerFormFieldsProps } from './formTypes'

const twoColumnGrid = 'grid gap-4 gap-y-3 md:grid-cols-2'

export function GeneralInformationSection({ values, onFieldChange }: CustomerFormFieldsProps) {
  return (
    <FormSection title="General Information">
      <div className={twoColumnGrid}>
        <SelectField
          id="customer-type"
          label="Customer type"
          value={values.customerType}
          options={['Company', 'Individual', 'Government', 'Nonprofit']}
          onChange={(value) => onFieldChange('customerType', value)}
        />
        <TextField
          id="customer-name"
          label="Customer name"
          value={values.customerName}
          placeholder="e.g. Grand Hotel"
          required
          onChange={(value) => onFieldChange('customerName', value)}
        />
        <TextField
          id="legal-company-name"
          label="Legal company name"
          value={values.legalCompanyName}
          placeholder="Grand Hotel Group LLC"
          onChange={(value) => onFieldChange('legalCompanyName', value)}
        />
        <TextField
          id="tax-number"
          label="Tax / VAT number"
          value={values.taxNumber}
          placeholder="US123456789"
          onChange={(value) => onFieldChange('taxNumber', value)}
        />
      </div>
    </FormSection>
  )
}

export function MainContactSection({ values, onFieldChange }: CustomerFormFieldsProps) {
  return (
    <FormSection title="Main Contact">
      <div className={twoColumnGrid}>
        <TextField
          id="contact-name"
          label="Contact name"
          value={values.contactName}
          placeholder="John Doe"
          onChange={(value) => onFieldChange('contactName', value)}
        />
        <TextField
          id="contact-email"
          label="Email"
          value={values.contactEmail}
          placeholder="j.doe@grandhotel.com"
          type="email"
          onChange={(value) => onFieldChange('contactEmail', value)}
        />
        <TextField
          id="contact-phone"
          label="Phone"
          value={values.contactPhone}
          placeholder="+1 (555) 000-0000"
          type="tel"
          onChange={(value) => onFieldChange('contactPhone', value)}
        />
        <TextField
          id="job-title"
          label="Job title"
          value={values.jobTitle}
          placeholder="Operations Manager"
          onChange={(value) => onFieldChange('jobTitle', value)}
        />
      </div>
    </FormSection>
  )
}
