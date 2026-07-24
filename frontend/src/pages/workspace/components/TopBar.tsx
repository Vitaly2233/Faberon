import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAccessToken } from '../../../api/auth-token'
import { Brand } from '../../../components/Brand'
import { useMe } from '../../login/hooks/useAuth'

function displayNameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? email
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function TopBar() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const me = useMe()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountMenuId = useId()
  const accountRef = useRef<HTMLDivElement>(null)

  const email = me.data?.email ?? ''
  const displayName = email ? displayNameFromEmail(email) : 'Account'
  const initial = (displayName.charAt(0) || 'A').toUpperCase()

  useEffect(() => {
    if (!accountOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [accountOpen])

  const signOut = () => {
    clearAccessToken()
    queryClient.clear()
    void navigate('/login', { replace: true })
  }

  return (
    <header className="flex h-header shrink-0 items-center gap-4 border-b border-header-line bg-header px-4 text-header-ink sm:px-6">
      <Brand tone="inverse" className="min-w-0" />

      <div className="ml-auto flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setAccountOpen(false)
              setNotificationsOpen((open) => !open)
            }}
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
            <div className="absolute right-0 top-11 w-80 overflow-hidden rounded-xl border border-header-line bg-header text-header-ink shadow-card">
              <div className="border-b border-header-line px-4 py-3">
                <p className="text-xs font-extrabold">Client notifications</p>
                <p className="text-caption text-header-copy">
                  Messages pushed to clients&apos; mobile app
                </p>
              </div>
              <div className="divide-y divide-header-line">
                <div className="px-4 py-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-caption font-bold text-header-copy">Grand Hotel</span>
                    <span className="text-2xs text-header-copy">Jul 16, 2026</span>
                  </div>
                  <p className="text-xs">WO #1042 — estimated ready date set to Jul 24, 2026.</p>
                </div>
                <div className="px-4 py-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-caption font-bold text-header-copy">River Tech</span>
                    <span className="text-2xs text-header-copy">Jul 15, 2026</span>
                  </div>
                  <p className="text-xs">WO #1044 — repair completed, awaiting your confirmation.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={accountRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(false)
              setAccountOpen((open) => !open)
            }}
            className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-header-line bg-header-field py-1 pl-1 pr-2.5 text-xs font-bold text-header-ink transition hover:border-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            aria-expanded={accountOpen}
            aria-haspopup="menu"
            aria-controls={accountMenuId}
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-header-ink text-xs font-extrabold text-header">
              {initial}
            </span>
            <span className="hidden max-w-40 truncate sm:inline">{displayName}</span>
            <ExpandMoreRoundedIcon
              fontSize="small"
              className={`text-header-copy transition-transform ${accountOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
          {accountOpen && (
            <div
              id={accountMenuId}
              role="menu"
              className="absolute right-0 top-11 w-[220px] overflow-hidden rounded-xl border border-header-line bg-header text-header-ink shadow-card"
            >
              <div className="border-b border-header-line px-3.5 py-3">
                <p className="truncate text-xs font-extrabold">{displayName}</p>
                <p className="truncate text-caption text-header-copy">{email || 'Signed in'}</p>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={signOut}
                className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-semibold text-header-copy transition hover:bg-header-field hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <LogoutRoundedIcon fontSize="small" aria-hidden="true" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
