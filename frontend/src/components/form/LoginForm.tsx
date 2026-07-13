import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { RememberMe } from './RememberMe'
import { TextField } from './TextField'
import type { LoginFormValues } from '../../types/login'

type LoginFormProps = LoginFormValues & {
  onEmailChange: (email: string) => void
  onPasswordChange: (password: string) => void
  onRememberMeChange: (rememberMe: boolean) => void
  onPasswordVisibilityToggle: () => void
  onForgotPassword: () => void
  onSubmit: () => void
}

export function LoginForm({
  email,
  password,
  rememberMe,
  isPasswordVisible,
  onEmailChange,
  onPasswordChange,
  onRememberMeChange,
  onPasswordVisibilityToggle,
  onForgotPassword,
  onSubmit,
}: LoginFormProps) {
  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <TextField
        id="email"
        label="Email Address"
        type="email"
        value={email}
        placeholder="name@company.com"
        icon={<EmailOutlinedIcon fontSize="small" />}
        autoComplete="email"
        onChange={onEmailChange}
      />
      <TextField
        id="password"
        label="Password"
        type={isPasswordVisible ? 'text' : 'password'}
        value={password}
        placeholder="••••••••••••"
        icon={<LockOutlinedIcon fontSize="small" />}
        autoComplete="current-password"
        onChange={onPasswordChange}
        endAdornment={
          isPasswordVisible ? (
            <VisibilityOffOutlinedIcon fontSize="small" />
          ) : (
            <VisibilityOutlinedIcon fontSize="small" />
          )
        }
        onEndAdornmentClick={onPasswordVisibilityToggle}
        endAdornmentLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
      />
      <div className="flex items-center justify-between gap-4">
        <RememberMe checked={rememberMe} onChange={onRememberMeChange} />
        <button
          type="button"
          onClick={onForgotPassword}
          className="cursor-pointer text-sm font-medium text-brand-strong transition hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Forgot password?
        </button>
      </div>
      <button
        type="submit"
        className="h-11 w-full cursor-pointer rounded-lg bg-brand text-sm font-semibold text-surface shadow-button transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:translate-y-px"
      >
        Sign In
      </button>
    </form>
  )
}
