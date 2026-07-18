import { Navigate, Route, Routes } from 'react-router-dom'
import { ModalsHost } from '../modals/ModalsHost'
import { CustomerDetailsPage } from '../pages/customers/CustomerDetailsPage'
import { CustomersPage } from '../pages/customers/CustomersPage'
import { LoginPage } from '../pages/login/LoginPage'
import { PrintersPage } from '../pages/printers/PrintersPage'
import { SettingsPage } from '../pages/settings/SettingsPage'
import { WorkOrdersPage } from '../pages/work-orders/WorkOrdersPage'
import { WorkspaceLayout } from '../pages/workspace/WorkspaceLayout'

export function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<WorkspaceLayout />}>
          <Route path="/work-orders" element={<WorkOrdersPage />} />
          <Route path="/work-orders/:workOrderId" element={<WorkOrdersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/:customerId" element={<CustomerDetailsPage />} />
          <Route path="/printers" element={<PrintersPage />} />
          <Route path="/printers/:printerId" element={<PrintersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ModalsHost />
    </>
  )
}
