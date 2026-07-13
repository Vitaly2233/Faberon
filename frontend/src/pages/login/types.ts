export interface LoginFormValues {
  email: string
  password: string
  rememberMe: boolean
  isPasswordVisible: boolean
}

export type SocialProvider = 'google' | 'microsoft' | 'apple'
