type BrandProps = {
  className?: string
  tone?: 'default' | 'inverse'
}

export function Brand({ className = '', tone = 'default' }: BrandProps) {
  const textColor = tone === 'inverse' ? 'text-surface' : 'text-ink'

  return (
    <div className={`flex items-center gap-2 ${textColor} ${className}`} aria-label="Faberon">
      <span className="flex size-6 items-center justify-center rounded-md bg-brand text-surface">
        <span className="text-xs font-bold" aria-hidden="true">F</span>
      </span>
      <span className="text-base font-bold tracking-tight">Faberon</span>
    </div>
  )
}
