import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { AuthField } from '@/components/auth/auth-field.component'
import { AuthShell } from '@/components/auth/auth-shell.component'
import { ButtonPrimary } from '@/components/common/button-primary.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { useAuth } from '@/hooks/use-auth.hook'
import { hapticFeedback } from '@/shared/haptic.util'

export function PasswordRecoveryScreen(): React.JSX.Element {
  const { isRequestingRecovery, requestPasswordRecovery, requestPasswordRecoveryError } = useAuth()
  const [email, setEmail] = useState('')
  const [isRequested, setIsRequested] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    try {
      await requestPasswordRecovery({ email })
      setIsRequested(true)
      await hapticFeedback.light()
    } catch {
      await hapticFeedback.selection()
    }
  }

  return (
    <AuthShell description="We’ll help you regain access without revealing account details." title="Recover your signal">
      {isRequested ? (
        <View className="gap-5 rounded-[1.25rem] border border-[#8ff5c6]/25 bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
          <Text className="font-[family-name:var(--font-pixel)] text-base tracking-[0.08em] text-[#9bffd0]">
            CHECK YOUR INBOX
          </Text>
          <Text className="text-sm leading-6 text-[var(--muted)]">
            If that account exists, we’ve sent a recovery link. Use the link to set a new password.
          </Text>
          <Link className="text-sm font-semibold text-[#e0b1ff]" to="/auth/reset">
            I have a recovery code
          </Link>
        </View>
      ) : (
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
          {requestPasswordRecoveryError ? (
            <View className="rounded-xl border border-[#ff998f]/35 bg-[#551718]/45 p-4">
              <Text className="text-sm leading-5 text-[#ffd0ca]">Unable to request recovery right now. Try again.</Text>
            </View>
          ) : null}
          <ButtonPrimary disabled={isRequestingRecovery} type="submit">
            {isRequestingRecovery ? 'Sending signal…' : 'Send recovery link'}
          </ButtonPrimary>
          <Link className="text-center text-sm font-semibold text-[#e0b1ff]" to="/auth/sign-in">
            Back to sign in
          </Link>
        </form>
      )}
    </AuthShell>
  )
}
