import type { SocialProvider } from '../types'

interface SocialLoginOptionsProps {
  onProviderSelect: (provider: SocialProvider) => void
}

const providers: Array<{ id: SocialProvider; label: string; mark: string }> = [
  { id: 'google', label: 'Google', mark: 'G' },
  { id: 'microsoft', label: 'Microsoft', mark: 'M' },
  { id: 'apple', label: 'Apple', mark: 'A' },
]

export function SocialLoginOptions({ onProviderSelect }: SocialLoginOptionsProps) {
  return (
    <section className="pt-8" aria-label="Other sign-in options">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="whitespace-nowrap text-xs font-medium text-copy">OR CONTINUE WITH</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {providers.map(({ id, label, mark }) => (
          <button
            key={id}
            type="button"
            onClick={() => onProviderSelect(id)}
            className="flex h-9 cursor-pointer items-center justify-center gap-1 rounded-lg border border-line bg-surface px-2 text-xs font-medium text-ink transition hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <span className="font-bold text-brand" aria-hidden="true">
              {mark}
            </span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
