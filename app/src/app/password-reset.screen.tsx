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

export function PasswordResetScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const { isResettingPassword, resetPassword, resetPasswordError } = useAuth()
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    try {
      await resetPassword({ password, token })
      setIsComplete(true)
      await hapticFeedback.light()
    } catch {
      await hapticFeedback.selection()
    }
  }

  return (
    <AuthShell description="Use the recovery code from the link we sent." title="Set a new password">
      {isComplete ? (
        <View className="gap-5 rounded-[1.25rem] border border-[#8ff5c6]/25 bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
          <Text className="font-[family-name:var(--font-pixel)] text-base tracking-[0.08em] text-[#9bffd0]">
            ACCESS RESTORED
          </Text>
          <Text className="text-sm leading-6 text-[var(--muted)]">Your password has been updated.</Text>
          <ButtonPrimary onClick={() => void navigate({ to: '/auth/sign-in' })}>
            Sign in now
          </ButtonPrimary>
        </View>
      ) : (
        <form className="flex flex-col gap-5" onSubmit={(event) => void handleSubmit(event)}>
          <AuthField
            autoCapitalize="none"
            label="Recovery code"
            onChange={(event) => setToken(event.target.value)}
            placeholder="Paste the code from your link"
            required
            value={token}
          />
          <AuthField
            autoComplete="new-password"
            label="New password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            required
            type="password"
            value={password}
          />
          {resetPasswordError ? (
            <View className="rounded-xl border border-[#ff998f]/35 bg-[#551718]/45 p-4">
              <Text className="text-sm leading-5 text-[#ffd0ca]">Unable to reset your password. Request another link.</Text>
            </View>
          ) : null}
          <ButtonPrimary disabled={isResettingPassword} type="submit">
            {isResettingPassword ? 'Restoring access…' : 'Update password'}
          </ButtonPrimary>
          <Link className="text-center text-sm font-semibold text-[#e0b1ff]" to="/auth/recovery">
            Request another link
          </Link>
        </form>
      )}
    </AuthShell>
  )
}
