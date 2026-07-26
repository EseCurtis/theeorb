import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { AuthField } from '@/components/auth/auth-field.component'
import { AuthFormFrame } from '@/components/auth/auth-form-frame.component'
import { AuthShell } from '@/components/auth/auth-shell.component'
import { ButtonPrimary } from '@/components/common/button-primary.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { useAuth } from '@/hooks/use-auth.hook'
import { hapticFeedback } from '@/shared/haptic.util'

export function SignInScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const { isSigningIn, signIn, signInError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    try {
      await signIn({ email, password })
      await hapticFeedback.light()
      await navigate({ to: '/app/home' })
    } catch {
      await hapticFeedback.selection()
    }
  }

  return (
    <AuthShell
      description="Return to the world your Orb will one day explore."
      systemLabel="ACCESS // 01"
      title="RE-ENTER THE WORLD"
    >
      <AuthFormFrame label="IDENTITY // SIGN IN">
        <form className="flex flex-col gap-4" onSubmit={(event) => void handleSubmit(event)}>
          <AuthField
            autoComplete="email"
            label="Email address"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
          <AuthField
            autoComplete="current-password"
            label="Password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            type="password"
            value={password}
          />
          {signInError ? (
            <View className="border border-[#ff998f]/55 bg-[#3a1014] p-3" role="alert">
              <Text className="text-[0.6rem] leading-5 text-[#ffd0ca]">{signInError.message}</Text>
            </View>
          ) : null}
          <ButtonPrimary disabled={isSigningIn} type="submit">
            {isSigningIn ? 'CONNECTING...' : 'ENTER THEE WORLD'}
          </ButtonPrimary>
        </form>
      </AuthFormFrame>
      <View className="items-center gap-4 pt-1">
        <Link className="text-[0.6rem] tracking-[0.06em] text-[#e9bcff]" to="/auth/recovery">
          LOST YOUR ACCESS CODE?
        </Link>
        <Text className="text-[0.58rem] tracking-[0.05em] text-[var(--muted)]">
          NEW TO THE ORB?{' '}
          <Link className="text-[#e9bcff]" to="/onboarding">
            TAKE THE TOUR
          </Link>
        </Text>
      </View>
    </AuthShell>
  )
}
