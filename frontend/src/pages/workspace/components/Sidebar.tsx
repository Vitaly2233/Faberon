import type { ElementType } from 'react'
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'

type NavigationItem = {
  label: string
  path: string
  icon: ElementType
  badge?: string
}

type SidebarProps = {
  activePath: string
  onNavigate: (path: string) => void
}

const navigationGroups: NavigationItem[][] = [
  [
    { label: 'Dashboard', path: '/dashboard', icon: DashboardOutlinedIcon },
    { label: 'Work orders', path: '/work-orders', icon: WorkOutlineOutlinedIcon, badge: '8' },
    { label: 'Maintenance plans', path: '/maintenance-plans', icon: HandymanOutlinedIcon },
    { label: 'Schedule', path: '/schedule', icon: CalendarMonthOutlinedIcon },
    { label: 'Map & routes', path: '/map-routes', icon: MapOutlinedIcon },
    { label: 'Customers', path: '/customers', icon: PeopleAltOutlinedIcon },
  ],
  [
    { label: 'Products', path: '/products', icon: Inventory2OutlinedIcon },
    { label: 'Workers', path: '/workers', icon: EngineeringOutlinedIcon },
    { label: 'Parts & inventory', path: '/inventory', icon: InventoryOutlinedIcon },
    { label: 'Purchase requests', path: '/purchase-requests', icon: ShoppingCartOutlinedIcon },
    { label: 'Contracts', path: '/contracts', icon: DescriptionOutlinedIcon },
    { label: 'Meter readings', path: '/meter-readings', icon: SpeedOutlinedIcon },
    { label: 'Billing & invoices', path: '/billing', icon: ReceiptLongOutlinedIcon },
  ],
  [
    { label: 'Reports', path: '/reports', icon: AssessmentOutlinedIcon },
    { label: 'Documents', path: '/documents', icon: FolderOutlinedIcon },
    { label: 'Admin & settings', path: '/settings', icon: TuneOutlinedIcon },
  ],
]

export function Sidebar({ activePath, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden min-h-0 w-56 shrink-0 flex-col border-r border-line bg-canvas p-2 md:flex">
      <nav className="min-h-0 overflow-y-auto" aria-label="Workspace navigation">
        {navigationGroups.map((group, groupIndex) => (
          <div
            key={group[0].path}
            className={groupIndex === 0 ? 'pb-2' : 'border-t border-line py-2'}
          >
            {group.map(({ label, path, icon: Icon, badge }) => {
              const isActive = activePath === path || activePath.startsWith(`${path}/`)

              return (
                <button
                  key={path}
                  type="button"
                  onClick={() => onNavigate(path)}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    isActive
                      ? 'bg-brand-soft text-brand-strong shadow-field'
                      : 'text-copy hover:bg-surface hover:text-ink'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon fontSize="small" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {badge && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-brand text-xs text-surface">
                      {badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}
