import type { ElementType } from 'react'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import { NavLink } from 'react-router-dom'
import { openWorkOrderCount, useWorkOrdersStore } from '../../../store/workOrdersStore'

type NavigationItem = {
  label: string
  path: string
  icon: ElementType
  badge?: string
}

function NavItem({ label, path, icon: Icon, badge }: NavigationItem) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `mb-1 flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
          isActive
            ? 'bg-sidebar-active text-sidebar-ink'
            : 'text-sidebar-copy hover:bg-sidebar-active hover:text-sidebar-ink'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            fontSize="small"
            className={isActive ? 'text-sidebar-ink' : 'text-sidebar-muted'}
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {badge && (
            <span className="flex size-5 items-center justify-center rounded-full bg-brand text-caption font-extrabold text-canvas">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

export function Sidebar() {
  const openCount = useWorkOrdersStore((state) => openWorkOrderCount(state.workOrders))

  const primaryItems: NavigationItem[] = [
    {
      label: 'Work orders',
      path: '/work-orders',
      icon: WorkOutlineOutlinedIcon,
      badge: String(openCount),
    },
    { label: 'Customers', path: '/customers', icon: PeopleAltOutlinedIcon },
    { label: 'Printers', path: '/printers', icon: PrintOutlinedIcon },
  ]

  return (
    <aside className="hidden w-sidebar shrink-0 flex-col border-r border-sidebar-line bg-sidebar md:flex">
      <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-4" aria-label="Workspace navigation">
        <div className="space-y-1">
          {primaryItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>
        <div className="my-3 border-t border-sidebar-line pt-3">
          <NavItem
            label="Admin & settings"
            path="/settings"
            icon={TuneOutlinedIcon}
          />
        </div>
      </nav>
    </aside>
  )
}
