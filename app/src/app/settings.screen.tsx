import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { ButtonPrimary } from '@/components/common/button-primary.component'
import { ButtonSecondary } from '@/components/common/button-secondary.component'
import { Panel } from '@/components/common/panel.component'
import { ScreenLayout } from '@/components/layout/screen-layout.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { useAuth } from '@/hooks/use-auth.hook'
import { hapticFeedback } from '@/shared/haptic.util'
import { applyTheme, readStoredTheme, storeTheme } from '@/shared/theme.util'

export function SettingsScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const { isSigningOut, session, signOut } = useAuth()
  const [currentTheme, setCurrentTheme] = useState(readStoredTheme())

  async function handleThemeChange(): Promise<void> {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'
    storeTheme(nextTheme)
    applyTheme(nextTheme)
    setCurrentTheme(nextTheme)
    await hapticFeedback.selection()
  }

  async function handleSignOut(): Promise<void> {
    await signOut()
    await hapticFeedback.light()
    await navigate({ replace: true, to: '/auth/sign-in' })
  }

  return (
    <ScreenLayout description="Control your own access to Thee World." title="Settings">
      <Panel>
        <Text className="font-[family-name:var(--font-pixel)] text-xs tracking-[0.1em] text-[#e0b1ff]">
          ACCOUNT
        </Text>
        <View className="gap-1">
          <Text className="text-base font-semibold text-[var(--foreground)]">
            {session?.user.displayName ?? 'Unknown traveller'}
          </Text>
          <Text className="text-sm text-[var(--muted)]">{session?.user.email ?? 'No email available'}</Text>
        </View>
      </Panel>
      <Panel>
        <Text className="font-[family-name:var(--font-pixel)] text-xs tracking-[0.1em] text-[#e0b1ff]">
          DISPLAY
        </Text>
        <Text className="text-sm leading-6 text-[var(--muted)]">
          Choose the interface light level that is most comfortable for you.
        </Text>
        <ButtonSecondary onClick={() => void handleThemeChange()}>
          Use {currentTheme === 'dark' ? 'light' : 'dark'} mode
        </ButtonSecondary>
      </Panel>
      <Panel>
        <Text className="font-[family-name:var(--font-pixel)] text-xs tracking-[0.1em] text-[#e0b1ff]">
          SESSION
        </Text>
        <Text className="text-sm leading-6 text-[var(--muted)]">
          Signing out removes this device’s local access token.
        </Text>
        <ButtonPrimary disabled={isSigningOut} onClick={() => void handleSignOut()}>
          {isSigningOut ? 'Signing out…' : 'Sign out'}
        </ButtonPrimary>
      </Panel>
    </ScreenLayout>
  )
}
