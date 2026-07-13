import { Navigate, Route, Routes } from 'react-router-dom'
import { CustomerDetailsPage } from '../pages/customers/CustomerDetailsPage'
import { CustomersPage } from '../pages/customers/CustomersPage'
import { NewCustomerPage } from '../pages/customers/NewCustomerPage'
import { LoginPage } from '../pages/login/LoginPage'
import { PlaceholderPage } from '../pages/workspace/PlaceholderPage'
import { WorkspaceLayout } from '../pages/workspace/WorkspaceLayout'

const placeholderRoutes = [
  { path: '/dashboard', title: 'Dashboard' },
  { path: '/work-orders', title: 'Work orders' },
  { path: '/maintenance-plans', title: 'Maintenance plans' },
  { path: '/schedule', title: 'Schedule' },
  { path: '/map-routes', title: 'Map & routes' },
  { path: '/products', title: 'Products' },
  { path: '/workers', title: 'Workers' },
  { path: '/inventory', title: 'Parts & inventory' },
  { path: '/purchase-requests', title: 'Purchase requests' },
  { path: '/contracts', title: 'Contracts' },
  { path: '/meter-readings', title: 'Meter readings' },
  { path: '/billing', title: 'Billing & invoices' },
  { path: '/reports', title: 'Reports' },
  { path: '/documents', title: 'Documents' },
  { path: '/settings', title: 'Admin & settings' },
]

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<WorkspaceLayout />}>
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/new" element={<NewCustomerPage />} />
        <Route path="/customers/:customerId" element={<CustomerDetailsPage />} />
        {placeholderRoutes.map(({ path, title }) => (
          <Route key={path} path={path} element={<PlaceholderPage title={title} />} />
        ))}
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
