export function HeroPanel() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-hero text-surface lg:flex lg:flex-col lg:justify-end">
      <img
        src="/images/service-operations-hero.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-hero/65" />
      <div className="absolute inset-0 bg-linear-to-t from-hero-deep via-hero/35 to-transparent" />

      <div className="relative z-10 px-6 pb-8 xl:px-10 xl:pb-10">
        <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
          Efficiency in the field, visibility in the office.
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-hero-copy">
          Join 4,000+ teams managing critical infrastructure operations with Faberon&apos;s unified platform.
        </p>
        <dl className="mt-6 flex gap-10">
          <div>
            <dt className="text-2xl font-bold">99.9%</dt>
            <dd className="mt-1 text-xs text-hero-copy">System Uptime</dd>
          </div>
          <div>
            <dt className="text-2xl font-bold">24/7</dt>
            <dd className="mt-1 text-xs text-hero-copy">Global Support</dd>
          </div>
        </dl>
      </div>
    </aside>
  )
}
