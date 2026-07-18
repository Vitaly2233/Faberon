type PlaceholderPageProps = {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="p-6 sm:p-8">
      <p className="text-sm font-medium text-copy">{title}</p>
      <h1 className="mt-1 text-page font-bold tracking-tight text-ink">{title}</h1>
      <div className="mt-6 min-h-96 rounded-xl border border-line bg-surface shadow-card" />
    </div>
  )
}
