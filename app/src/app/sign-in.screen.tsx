import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { AuthField } from '@/components/auth/auth-field.component'
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
    <AuthShell description="Your Orb’s world is waiting for you." title="Return to Thee World">
      <form className="flex flex-col gap-5" onSubmit={(event) => void handleSubmit(event)}>
        <AuthField
          autoComplete="email"
          label="Email"
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
          placeholder="Your password"
          required
          type="password"
          value={password}
        />
        {signInError ? (
          <View className="rounded-xl border border-[#ff998f]/35 bg-[#551718]/45 p-4">
            <Text className="text-sm leading-5 text-[#ffd0ca]">{signInError.message}</Text>
          </View>
        ) : null}
        <ButtonPrimary disabled={isSigningIn} type="submit">
          {isSigningIn ? 'Entering Thee World…' : 'Enter Thee World'}
        </ButtonPrimary>
        <View className="items-center gap-4">
          <Link className="text-sm font-semibold text-[#e0b1ff]" to="/auth/recovery">
            Forgot your password?
          </Link>
          <Text className="text-sm text-[var(--muted)]">
            New here?{' '}
            <Link className="font-semibold text-[#e0b1ff]" to="/auth/sign-up">
              Create your account
            </Link>
          </Text>
        </View>
      </form>
    </AuthShell>
  )
}
