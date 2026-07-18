import { Outlet } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'

export function WorkspaceLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <TopBar />
      <div className="flex min-h-0 min-w-0 flex-1">
        <Sidebar />
        <main className="min-h-0 flex-1 overflow-auto bg-canvas">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
