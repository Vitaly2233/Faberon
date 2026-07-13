const scheduleItems = [
  {
    time: 'Oct 12 · 09:00 AM',
    title: 'Generator maintenance',
    detail: 'Engineer: Mia T.',
    emphasized: true,
  },
  {
    time: 'Oct 15 · 02:00 PM',
    title: 'HVAC quarterly inspection',
    detail: 'Engineer: Chris K.',
    emphasized: false,
  },
]

export function UpcomingSchedule() {
  return (
    <section className="rounded-xl border border-line bg-surface p-4 shadow-field">
      <h2 className="text-sm font-semibold text-ink">Upcoming schedule</h2>
      <div className="mt-3 space-y-2">
        {scheduleItems.map(({ time, title, detail, emphasized }) => (
          <article
            key={title}
            className={`rounded-lg border p-3 ${
              emphasized
                ? 'border-brand bg-brand-soft'
                : 'border-line bg-canvas'
            }`}
          >
            <p className="text-xs font-semibold uppercase text-copy">{time}</p>
            <h3 className="mt-1 text-xs font-semibold text-ink">{title}</h3>
            <p className="mt-1 text-xs text-copy">{detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
