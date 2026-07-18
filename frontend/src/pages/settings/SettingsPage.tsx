import { useCompanyStore } from '../../store/companyStore'
import { CompanyProfileForm } from './components/CompanyProfileForm'
import { useState } from 'react'

export function SettingsPage() {
  const company = useCompanyStore((state) => state.company)
  const setCompany = useCompanyStore((state) => state.setCompany)
  const [form, setForm] = useState(company)
  const [isSaved, setIsSaved] = useState(false)
  const isDirty = JSON.stringify(form) !== JSON.stringify(company)

  return (
    <div className="p-6 sm:p-8">
      <header className="mb-6">
        <p className="text-sm font-medium text-copy">Owner only</p>
        <h1 className="mt-1 text-page font-extrabold tracking-tight text-ink">
          Admin & settings
        </h1>
      </header>

      <div className="max-w-content">
        <CompanyProfileForm
          value={form}
          isDirty={isDirty}
          isSaved={isSaved}
          onChange={(next) => {
            setForm(next)
            setIsSaved(false)
          }}
          onSave={() => {
            setCompany(form)
            setIsSaved(true)
            window.setTimeout(() => setIsSaved(false), 1600)
          }}
        />
      </div>
    </div>
  )
}
