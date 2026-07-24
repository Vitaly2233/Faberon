import { Navigate, Outlet } from 'react-router-dom'
import { getAccessToken } from '../api/auth-token'
import { useMe } from '../pages/login/hooks/useAuth'

export function RequireAuth() {
  const hasToken = Boolean(getAccessToken())
  const me = useMe()

  if (!hasToken) {
    return <Navigate to="/login" replace />
  }

  if (me.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-copy">
        Loading…
      </div>
    )
  }

  if (me.isError) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
