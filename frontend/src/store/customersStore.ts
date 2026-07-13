import { create } from 'zustand'

type CustomersStore = {
  searchQuery: string
  currentPage: number
  setSearchQuery: (searchQuery: string) => void
  setCurrentPage: (currentPage: number) => void
}

export const useCustomersStore = create<CustomersStore>((set) => ({
  searchQuery: '',
  currentPage: 1,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCurrentPage: (currentPage) => set({ currentPage }),
}))
