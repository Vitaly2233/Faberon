import type { ReactNode } from 'react'

const controlClassName =
  'mt-1 h-10 w-full rounded-lg border border-line bg-canvas px-3 text-sm normal-case tracking-normal text-ink shadow-field outline-none transition placeholder:text-copy/70 focus:border-brand focus:ring-2 focus:ring-brand/15'

type FormSectionProps = {
  title: string
  children: ReactNode
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <section>
      <h2 className="border-b border-line pb-2 text-sm font-bold text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

type TextFieldProps = {
  id: string
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel'
  required?: boolean
}

export function TextField({
  id,
  label,
  value,
  placeholder,
  onChange,
  type = 'text',
  required = false,
}: TextFieldProps) {
  return (
    <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-copy">
      {label}
      {required && <span aria-hidden="true"> *</span>}
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className={controlClassName}
      />
    </label>
  )
}

type SelectFieldProps<Value extends string> = {
  id: string
  label: string
  value: Value
  options: readonly Value[]
  onChange: (value: Value) => void
}

export function SelectField<Value extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: SelectFieldProps<Value>) {
  return (
    <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-copy">
      {label}
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as Value)}
        className={`${controlClassName} cursor-pointer`}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}
