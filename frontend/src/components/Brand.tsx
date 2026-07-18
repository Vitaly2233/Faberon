type BrandProps = {
  className?: string
  tone?: 'default' | 'inverse' | 'sidebar'
}

export function Brand({ className = '', tone = 'default' }: BrandProps) {
  const textColor =
    tone === 'inverse' ? 'text-header-ink' : tone === 'sidebar' ? 'text-sidebar-ink' : 'text-ink'
  const markClass =
    tone === 'inverse'
      ? 'rounded-full bg-header-ink text-header'
      : 'rounded-lg bg-brand text-canvas'

  return (
    <div className={`flex items-center gap-2.5 ${textColor} ${className}`} aria-label="Faberon">
      <span className={`flex size-7 shrink-0 items-center justify-center ${markClass}`}>
        <span className="text-xs font-bold" aria-hidden="true">
          F
        </span>
      </span>
      <span className="truncate text-sm font-extrabold tracking-tight">Faberon Service Co.</span>
    </div>
  )
}
