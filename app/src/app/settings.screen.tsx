import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { ButtonPrimary } from '@/components/common/button-primary.component'
import { ButtonSecondary } from '@/components/common/button-secondary.component'
import { Panel } from '@/components/common/panel.component'
import { ScreenLayout } from '@/components/layout/screen-layout.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { useAuth } from '@/hooks/use-auth.hook'
import { useApplications } from '@/hooks/use-applications.hook'
import { hapticFeedback } from '@/shared/haptic.util'
import { applyTheme, readStoredTheme, storeTheme } from '@/shared/theme.util'

export function SettingsScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const { isSigningOut, session, signOut } = useAuth()
  const { getGmailConnectionUrl, gmailConnection, isLoadingGmail } = useApplications()
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

  async function handleGmailConnect(): Promise<void> {
    const authorizationUrl = await getGmailConnectionUrl()
    window.location.assign(authorizationUrl)
  }

  return (
    <ScreenLayout description="Control your private workspace, connected email, and device access." title="Settings">
      <Panel label="ACCOUNT // LINKED" tone="violet">
        <View className="gap-1">
          <Text className="text-base font-semibold text-[var(--foreground)]">
            {session?.user.displayName ?? 'Unknown traveller'}
          </Text>
          <Text className="text-sm text-[var(--muted)]">{session?.user.email ?? 'No email available'}</Text>
        </View>
      </Panel>
      <Panel label="GMAIL // EXPLICIT SEND" tone="cyan">
        <Text className="text-sm leading-6 text-[var(--muted)]">
          {isLoadingGmail ? 'Checking your Gmail connection...' : gmailConnection ? `Connected as ${gmailConnection.email}. Applications never send without your final review.` : 'Connect Gmail to send a reviewed application with your selected CV attached.'}
        </Text>
        {!gmailConnection && !isLoadingGmail ? <ButtonSecondary onClick={() => void handleGmailConnect()}>CONNECT GMAIL</ButtonSecondary> : null}
      </Panel>
      <Panel label="DISPLAY // LOCAL" tone="cyan">
        <Text className="text-sm leading-6 text-[var(--muted)]">
          Choose the interface light level that is most comfortable for you.
        </Text>
        <ButtonSecondary onClick={() => void handleThemeChange()}>
          Use {currentTheme === 'dark' ? 'light' : 'dark'} mode
        </ButtonSecondary>
      </Panel>
      <Panel label="SESSION // DEVICE" tone="pink">
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
