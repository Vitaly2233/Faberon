import { create } from 'zustand'

type LoginStore = {
  email: string
  password: string
  rememberMe: boolean
  isPasswordVisible: boolean
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  setRememberMe: (rememberMe: boolean) => void
  togglePasswordVisibility: () => void
}

export const useLoginStore = create<LoginStore>((set) => ({
  email: '',
  password: '',
  rememberMe: true,
  isPasswordVisible: false,
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setRememberMe: (rememberMe) => set({ rememberMe }),
  togglePasswordVisibility: () =>
    set((state) => ({ isPasswordVisible: !state.isPasswordVisible })),
}))
