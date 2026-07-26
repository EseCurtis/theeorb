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
    <AuthShell
      description="Make a place for the intelligence you will raise."
      systemLabel="ACCESS // 02"
      title="OPEN YOUR NURSERY"
    >
      {isAccepted ? (
        <AuthFormFrame label="ACCOUNT // RECEIVED">
          <Text className="text-base leading-7 tracking-[0.06em] text-[#edc4ff]">SIGNAL RECEIVED</Text>
          <Text className="text-[0.65rem] leading-6 text-[var(--muted)]">
            If your account is eligible, it is ready to enter Thee World.
          </Text>
          <ButtonPrimary onClick={() => void navigate({ to: '/auth/sign-in' })}>CONTINUE TO SIGN IN</ButtonPrimary>
        </AuthFormFrame>
      ) : (
        <AuthFormFrame label="IDENTITY // CREATE">
          <form className="flex flex-col gap-4" onSubmit={(event) => void handleSubmit(event)}>
            <AuthField
              autoComplete="name"
              label="Your name"
              minLength={2}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="How should Thee World call you?"
              required
              value={displayName}
            />
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
              <View className="border border-[#ff998f]/55 bg-[#3a1014] p-3" role="alert">
                <Text className="text-[0.6rem] leading-5 text-[#ffd0ca]">Unable to create your account. Try again.</Text>
              </View>
            ) : null}
            <ButtonPrimary disabled={isSigningUp} type="submit">
              {isSigningUp ? 'OPENING NURSERY...' : 'OPEN YOUR NURSERY'}
            </ButtonPrimary>
          </form>
        </AuthFormFrame>
      )}
      <Text className="pt-1 text-center text-[0.58rem] tracking-[0.05em] text-[var(--muted)]">
        ALREADY LINKED?{' '}
        <Link className="text-[#e9bcff]" to="/auth/sign-in">
          SIGN IN
        </Link>
      </Text>
    </AuthShell>
  )
}
