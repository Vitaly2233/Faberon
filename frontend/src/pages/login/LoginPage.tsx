import { Navigate, useNavigate } from 'react-router-dom'
import { Brand } from '../../components/Brand'
import { useLoginStore } from '../../store/loginStore'
import { HeroPanel } from './components/HeroPanel'
import { LoginForm } from './components/LoginForm'
import { PageFooter } from './components/PageFooter'
import { useLogin, useMe } from './hooks/useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const email = useLoginStore((state) => state.email)
  const password = useLoginStore((state) => state.password)
  const rememberMe = useLoginStore((state) => state.rememberMe)
  const isPasswordVisible = useLoginStore((state) => state.isPasswordVisible)
  const setEmail = useLoginStore((state) => state.setEmail)
  const setPassword = useLoginStore((state) => state.setPassword)
  const setRememberMe = useLoginStore((state) => state.setRememberMe)
  const togglePasswordVisibility = useLoginStore((state) => state.togglePasswordVisibility)
  const login = useLogin()
  const me = useMe()

  if (me.isSuccess) {
    return <Navigate to="/customers" replace />
  }

  const errorMessage =
    login.error instanceof Error
      ? login.error.message
      : login.error
        ? 'Failed to sign in.'
        : null

  return (
    <main className="auth-theme grid min-h-screen bg-canvas lg:grid-cols-[30rem_1fr]">
      <section className="flex min-h-screen flex-col bg-surface px-6 py-8 sm:px-12 lg:px-10">
        <Brand />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Sign In</h1>
            <p className="mt-2 text-xs leading-relaxed text-copy">
              Owner and technician access. Clients use the mobile app.
            </p>
          </div>
          <div className="mt-6">
            {errorMessage ? (
              <p className="mb-4 text-sm text-danger" role="alert">
                {errorMessage}
              </p>
            ) : null}
            <LoginForm
              email={email}
              password={password}
              rememberMe={rememberMe}
              isPasswordVisible={isPasswordVisible}
              isSubmitting={login.isPending}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onRememberMeChange={setRememberMe}
              onPasswordVisibilityToggle={togglePasswordVisibility}
              onForgotPassword={() => undefined}
              onSubmit={() => {
                void login.mutateAsync({ email, password }).then(() => {
                  void navigate('/customers')
                })
              }}
            />
          </div>
        </div>
        <PageFooter />
      </section>
      <HeroPanel />
    </main>
  )
}
