type PlaceholderPageProps = {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="p-3 sm:p-5">
      <p className="text-xs font-medium text-copy">{title}</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">{title}</h1>
      <div className="mt-4 min-h-96 rounded-xl border border-line bg-canvas" />
    </div>
  )
}
