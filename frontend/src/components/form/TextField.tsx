import type { ReactNode } from 'react'

export interface TextFieldProps {
  id: string
  label: string
  type: 'email' | 'password' | 'text'
  value: string
  placeholder: string
  icon: ReactNode
  autoComplete: string
  onChange: (value: string) => void
  endAdornment?: ReactNode
  onEndAdornmentClick?: () => void
  endAdornmentLabel?: string
}

export function TextField({
  id,
  label,
  type,
  value,
  placeholder,
  icon,
  autoComplete,
  onChange,
  endAdornment,
  onEndAdornmentClick,
  endAdornmentLabel,
}: TextFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="flex h-10 items-center rounded-lg border border-line bg-surface px-3 shadow-field transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand-soft">
        <span className="mr-2.5 flex text-copy" aria-hidden="true">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-copy"
        />
        {endAdornment && (
          <button
            type="button"
            onClick={onEndAdornmentClick}
            aria-label={endAdornmentLabel}
            className="ml-2 flex cursor-pointer text-copy transition hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {endAdornment}
          </button>
        )}
      </div>
    </div>
  )
}
