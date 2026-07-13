import { useNavigate } from 'react-router-dom'
import { Brand } from '../../components/Brand'
import { HeroPanel } from '../../components/HeroPanel'
import { PageFooter } from '../../components/PageFooter'
import { LoginForm } from '../../components/form/LoginForm'
import { SocialLoginOptions } from '../../components/form/SocialLoginOptions'
import { useLoginStore } from '../../store/loginStore'

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

  return (
    <main className="grid min-h-screen bg-canvas lg:grid-cols-[26%_1fr]">
      <section className="flex min-h-screen flex-col px-6 py-7 sm:px-12 lg:px-7 xl:px-10">
        <Brand />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Sign In</h1>
            <p className="mt-2 text-sm leading-snug text-copy">
              Enter your credentials to access your organization&apos;s hub.
            </p>
          </div>
          <div className="mt-6">
            <LoginForm
              email={email}
              password={password}
              rememberMe={rememberMe}
              isPasswordVisible={isPasswordVisible}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onRememberMeChange={setRememberMe}
              onPasswordVisibilityToggle={togglePasswordVisibility}
              onForgotPassword={() => undefined}
              onSubmit={() => navigate('/customers')}
            />
          </div>
          <SocialLoginOptions onProviderSelect={() => undefined} />
        </div>
        <PageFooter />
      </section>
      <HeroPanel />
    </main>
  )
}
