import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'

import { AppTabNavigator } from '@/components/navigation/app-tab-navigator.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { useAuth } from '@/hooks/use-auth.hook'

export function AuthenticatedAppShell(): React.JSX.Element {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const { isLoadingSession, session, sessionError } = useAuth()
  const isSubscreen = pathname === '/app/career-profile' || pathname === '/app/cv-vault' || pathname.startsWith('/app/applications/')

  useEffect(() => {
    if (isLoadingSession || session) {
      return
    }

    void navigate({ replace: true, to: '/auth/sign-in' })
  }, [isLoadingSession, navigate, session, sessionError])

  if (isLoadingSession) {
    return (
      <View className="min-h-dvh items-center justify-center bg-[var(--background)] px-6">
        <Text className="font-[family-name:var(--font-pixel)] text-sm tracking-[0.12em] text-[#e0b1ff]">
          RESTORING THEE WORLD
        </Text>
      </View>
    )
  }

  if (!session) {
    return <View className="min-h-dvh bg-[var(--background)]" />
  }

  return (
    <View className={isSubscreen ? 'min-h-dvh bg-[var(--background)]' : 'min-h-dvh bg-[var(--background)] pb-[calc(5.5rem+var(--safe-area-inset-bottom))]'}>
      <Outlet />
      {!isSubscreen ? <AppTabNavigator /> : null}
    </View>
  )
}
