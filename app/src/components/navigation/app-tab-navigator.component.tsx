import { Link } from '@tanstack/react-router'

import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'

export function AppTabNavigator(): React.JSX.Element {
  return (
    <View className="fixed bottom-0 left-0 right-0 z-20 border-t border-[var(--border)] bg-[color:color-mix(in_srgb,var(--background)_88%,transparent)] px-[calc(1rem+var(--safe-area-inset-left))] pb-[calc(0.85rem+var(--safe-area-inset-bottom))] pr-[calc(1rem+var(--safe-area-inset-right))] pt-3 backdrop-blur-xl">
      <View className="mx-auto flex w-full max-w-md flex-row justify-around">
        <Link
          activeProps={{ className: 'text-[var(--foreground)]' }}
          className="flex min-w-20 flex-col items-center gap-1 text-[var(--muted)]"
          to="/app/home"
        >
          <Text className="font-[family-name:var(--font-pixel)] text-xs tracking-[0.08em]">HOME</Text>
        </Link>
        <Link
          activeProps={{ className: 'text-[var(--foreground)]' }}
          className="flex min-w-20 flex-col items-center gap-1 text-[var(--muted)]"
          to="/app/settings"
        >
          <Text className="font-[family-name:var(--font-pixel)] text-xs tracking-[0.08em]">SETTINGS</Text>
        </Link>
      </View>
    </View>
  )
}
