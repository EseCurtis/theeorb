import { Link } from '@tanstack/react-router'
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
    <AuthShell
      description="We will help you restore access without revealing account details."
      systemLabel="RECOVERY // 01"
      title="RECLAIM YOUR SIGNAL"
    >
      {isRequested ? (
        <AuthFormFrame label="RECOVERY // SENT">
          <Text className="text-base leading-7 tracking-[0.06em] text-[#9bffd0]">CHECK YOUR INBOX</Text>
          <Text className="text-sm leading-6 text-[var(--muted)]">
            If that account exists, we’ve sent a recovery link. Use the link to set a new password.
          </Text>
          <Link className="text-[0.62rem] tracking-[0.06em] text-[#e9bcff]" to="/auth/reset">
            I HAVE A RECOVERY CODE
          </Link>
        </AuthFormFrame>
      ) : (
        <AuthFormFrame label="RECOVERY // REQUEST">
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
            {requestPasswordRecoveryError ? (
              <View className="border border-[#ff998f]/55 bg-[#3a1014] p-3" role="alert">
                <Text className="text-[0.6rem] leading-5 text-[#ffd0ca]">Unable to request recovery right now. Try again.</Text>
              </View>
            ) : null}
            <ButtonPrimary disabled={isRequestingRecovery} type="submit">
              {isRequestingRecovery ? 'SENDING SIGNAL...' : 'SEND RECOVERY LINK'}
            </ButtonPrimary>
          </form>
        </AuthFormFrame>
      )}
      <Link className="pt-1 text-center text-[0.58rem] tracking-[0.05em] text-[#e9bcff]" to="/auth/sign-in">
        BACK TO SIGN IN
      </Link>
    </AuthShell>
  )
}
