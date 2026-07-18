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
        <h2 className="max-w-md text-3xl font-bold leading-[1.1] tracking-tight xl:text-4xl">
          Every repair,<br />tracked to the<br />last page.
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-hero-copy">
          Manage printers, work orders, and invoices in one place — while clients follow every update from their phone.
        </p>
      </div>
    </aside>
  )
}
