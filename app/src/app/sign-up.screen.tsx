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

export function SignUpScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const { isSigningUp, signUp, signUpError } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAccepted, setIsAccepted] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    try {
      await signUp({ displayName, email, password })
      setIsAccepted(true)
      await hapticFeedback.light()
    } catch {
      await hapticFeedback.selection()
    }
  }

  return (
    <AuthShell description="Create a home for the intelligence you’ll raise." title="Awaken your Orb">
      {isAccepted ? (
        <View className="gap-5 rounded-[1.25rem] border border-[#d8a4ff]/30 bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
          <Text className="font-[family-name:var(--font-pixel)] text-base tracking-[0.08em] text-[#edc4ff]">
            SIGNAL RECEIVED
          </Text>
          <Text className="text-sm leading-6 text-[var(--muted)]">
            If your account is eligible, it is ready to enter Thee World.
          </Text>
          <ButtonPrimary onClick={() => void navigate({ to: '/auth/sign-in' })}>
            Continue to sign in
          </ButtonPrimary>
        </View>
      ) : (
        <form className="flex flex-col gap-5" onSubmit={(event) => void handleSubmit(event)}>
          <AuthField
            autoComplete="name"
            label="Your name"
            minLength={2}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="What should Thee World call you?"
            required
            value={displayName}
          />
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
            autoComplete="new-password"
            label="Password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            required
            type="password"
            value={password}
          />
          {signUpError ? (
            <View className="rounded-xl border border-[#ff998f]/35 bg-[#551718]/45 p-4">
              <Text className="text-sm leading-5 text-[#ffd0ca]">Unable to create your account. Try again.</Text>
            </View>
          ) : null}
          <ButtonPrimary disabled={isSigningUp} type="submit">
            {isSigningUp ? 'Awakening…' : 'Awaken your Orb'}
          </ButtonPrimary>
          <Text className="text-center text-sm text-[var(--muted)]">
            Already have an account?{' '}
            <Link className="font-semibold text-[#e0b1ff]" to="/auth/sign-in">
              Sign in
            </Link>
          </Text>
        </form>
      )}
    </AuthShell>
  )
}
