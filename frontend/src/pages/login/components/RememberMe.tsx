interface RememberMeProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function RememberMe({ checked, onChange }: RememberMeProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 cursor-pointer rounded border-line accent-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      />
      Remember me
    </label>
  )
}
