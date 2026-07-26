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
    <AuthShell
      description="Use the recovery code from the link we sent."
      systemLabel="RECOVERY // 02"
      title="SET A NEW PASSWORD"
    >
      {isComplete ? (
        <AuthFormFrame label="RECOVERY // COMPLETE">
          <Text className="text-base leading-7 tracking-[0.06em] text-[#9bffd0]">ACCESS RESTORED</Text>
          <Text className="text-sm leading-6 text-[var(--muted)]">Your password has been updated.</Text>
          <ButtonPrimary onClick={() => void navigate({ to: '/auth/sign-in' })}>SIGN IN NOW</ButtonPrimary>
        </AuthFormFrame>
      ) : (
        <AuthFormFrame label="RECOVERY // VERIFY">
          <form className="flex flex-col gap-4" onSubmit={(event) => void handleSubmit(event)}>
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
              <View className="border border-[#ff998f]/55 bg-[#3a1014] p-3" role="alert">
                <Text className="text-[0.6rem] leading-5 text-[#ffd0ca]">Unable to reset your password. Request another link.</Text>
              </View>
            ) : null}
            <ButtonPrimary disabled={isResettingPassword} type="submit">
              {isResettingPassword ? 'RESTORING ACCESS...' : 'UPDATE PASSWORD'}
            </ButtonPrimary>
          </form>
        </AuthFormFrame>
      )}
      <Link className="pt-1 text-center text-[0.58rem] tracking-[0.05em] text-[#e9bcff]" to="/auth/recovery">
        REQUEST ANOTHER LINK
      </Link>
    </AuthShell>
  )
}
