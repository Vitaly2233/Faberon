import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import { useState } from 'react'
import { Brand } from '../../../components/Brand'

type WorkspaceRole = 'owner' | 'technician'

export function TopBar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [role, setRole] = useState<WorkspaceRole>('owner')

  return (
    <header className="flex h-header shrink-0 items-center gap-4 border-b border-header-line bg-header px-4 text-header-ink sm:px-6">
      <Brand tone="inverse" className="min-w-0" />

      <div className="ml-auto flex items-center gap-3">
        <div
          className="flex rounded-full border border-header-line bg-header-field p-0.5"
          role="group"
          aria-label="Workspace role"
        >
          <button
            type="button"
            onClick={() => setRole('owner')}
            className={`h-7 cursor-pointer rounded-full px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              role === 'owner'
                ? 'bg-header-ink text-header'
                : 'text-header-copy hover:text-header-ink'
            }`}
            aria-pressed={role === 'owner'}
          >
            Owner
          </button>
          <button
            type="button"
            onClick={() => setRole('technician')}
            className={`h-7 cursor-pointer rounded-full px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              role === 'technician'
                ? 'bg-header-ink text-header'
                : 'text-header-copy hover:text-header-ink'
            }`}
            aria-pressed={role === 'technician'}
          >
            Technician
          </button>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative flex size-8 cursor-pointer items-center justify-center rounded-lg text-header-copy transition hover:bg-header-field hover:text-header-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
          >
            <NotificationsNoneRoundedIcon fontSize="small" />
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-danger text-micro font-extrabold text-ink">
              2
            </span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-11 w-80 overflow-hidden rounded-xl border border-line bg-surface text-ink shadow-card">
              <div className="border-b border-line px-4 py-3">
                <p className="text-xs font-extrabold">Client notifications</p>
                <p className="text-caption text-copy">Messages pushed to clients&apos; mobile app</p>
              </div>
              <div className="divide-y divide-line-soft">
                <div className="px-4 py-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-caption font-bold">Grand Hotel</span>
                    <span className="text-2xs text-copy">Jul 16, 2026</span>
                  </div>
                  <p className="text-xs">WO #1042 — estimated ready date set to Jul 24, 2026.</p>
                </div>
                <div className="px-4 py-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-caption font-bold">River Tech</span>
                    <span className="text-2xs text-copy">Jul 15, 2026</span>
                  </div>
                  <p className="text-xs">WO #1044 — repair completed, awaiting your confirmation.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex h-9 cursor-pointer items-center gap-2 rounded-full border border-header-line bg-header-field py-1 pl-1 pr-2.5 text-xs font-bold text-header-ink transition hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-header-ink text-xs font-extrabold text-header">
            M
          </span>
          <span className="hidden sm:inline">Mike Andrew</span>
          <ExpandMoreRoundedIcon fontSize="small" className="text-header-copy" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
