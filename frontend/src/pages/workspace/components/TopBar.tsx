import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Brand } from '../../../components/Brand'

type TopBarProps = {
  onSearchChange: (query: string) => void
  onProfileClick: () => void
}

export function TopBar({ onSearchChange, onProfileClick }: TopBarProps) {
  return (
    <header className="grid h-14 grid-cols-[1fr_auto] items-center gap-4 bg-hero-deep px-3 text-surface md:grid-cols-[1fr_minmax(18rem,32rem)_1fr]">
      <Brand tone="inverse" />
      <label className="hidden h-9 items-center rounded-lg bg-surface/10 px-3 text-hero-copy md:flex">
        <SearchRoundedIcon fontSize="small" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search customers, work orders..."
          onChange={(event) => onSearchChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-surface outline-none placeholder:text-hero-copy"
          aria-label="Search workspace"
        />
        <span className="text-xs text-hero-copy" aria-hidden="true">⌘ K</span>
      </label>
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-hero-copy transition hover:bg-surface/10 hover:text-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          aria-label="Notifications"
        >
          <NotificationsNoneRoundedIcon fontSize="small" />
        </button>
        <button
          type="button"
          onClick={onProfileClick}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-surface/10 px-2 py-1.5 text-xs font-medium text-surface transition hover:bg-surface/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-surface text-xs font-semibold text-ink">
            MA
          </span>
          <span className="hidden sm:inline">Mike Andrew</span>
          <ExpandMoreRoundedIcon fontSize="small" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
