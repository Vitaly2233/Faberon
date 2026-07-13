export function PageFooter() {
  return (
    <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-copy lg:justify-start">
      <span className="whitespace-nowrap">© 2026 Faberon Inc.</span>
      <a href="#privacy" className="whitespace-nowrap transition hover:text-ink">Privacy Policy</a>
      <a href="#terms" className="whitespace-nowrap transition hover:text-ink">Terms of Service</a>
      <a href="mailto:contact@faberon.io" className="whitespace-nowrap transition hover:text-ink">
        contact@faberon.io
      </a>
    </footer>
  )
}
