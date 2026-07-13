import type { NewCustomerField, NewCustomerFormValues } from '../../types'

export type CustomerFormFieldsProps = {
  values: NewCustomerFormValues
  onFieldChange: <Field extends NewCustomerField>(
    field: Field,
    value: NewCustomerFormValues[Field],
  ) => void
}
