import { create } from 'zustand'

export type CompanyProfile = {
  name: string
  address: string
  logo: string | null
}

type CompanyStore = {
  company: CompanyProfile
  setCompany: (company: CompanyProfile) => void
}

const initialCompany: CompanyProfile = {
  name: 'Faberon Service Co.',
  address: '102 Ocean Blvd, Miami, FL 33101',
  logo: null,
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  company: initialCompany,
  setCompany: (company) => set({ company }),
}))
