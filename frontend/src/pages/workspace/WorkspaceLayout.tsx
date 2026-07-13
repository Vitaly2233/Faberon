import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'

export function WorkspaceLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TopBar onSearchChange={() => undefined} onProfileClick={() => undefined} />
      <div className="flex min-h-0 flex-1 gap-3 bg-surface p-2">
        <Sidebar activePath={location.pathname} onNavigate={navigate} />
        <main className="min-w-0 flex-1 overflow-auto bg-surface">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
