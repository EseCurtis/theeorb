import type { ReactNode } from 'react'

import { BrandLogo } from '@/components/brand/brand-logo.component'
import { CosmicBackground } from '@/components/common/cosmic-background.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'

type AuthShellProps = {
  readonly children: ReactNode
  readonly description: string
  readonly systemLabel: string
  readonly title: string
}

export function AuthShell({
  children,
  description,
  systemLabel,
  title,
}: AuthShellProps): React.JSX.Element {
  return (
    <View className="relative min-h-dvh overflow-hidden bg-[var(--background)] px-[calc(1.25rem+var(--safe-area-inset-left))] pb-[calc(2rem+var(--safe-area-inset-bottom))] pr-[calc(1.25rem+var(--safe-area-inset-right))] pt-[calc(1.25rem+var(--safe-area-inset-top))]">
      <CosmicBackground />
      <View className="relative mx-auto w-full max-w-md gap-7">
        <View className="flex-row items-center justify-between border-b border-[#b66bea]/25 pb-4">
          <View className="flex-row items-center gap-3">
            <BrandLogo className="size-10 rounded-full border border-[#dda7ff]/55 shadow-[0_0_20px_rgba(190,76,255,0.45)]" />
            <Text className="text-sm tracking-[0.1em] text-[var(--foreground)]">
              THEE ORB
            </Text>
          </View>
          <Text className="text-[0.55rem] tracking-[0.08em] text-[#c899df]">{systemLabel}</Text>
        </View>
        <View className="gap-3">
          <Text className="text-[1.55rem] leading-[1.45] tracking-[0.06em] text-[var(--foreground)]">
            {title}
          </Text>
          <Text className="max-w-sm text-[0.68rem] leading-6 tracking-[0.04em] text-[var(--muted)]">{description}</Text>
        </View>
        {children}
      </View>
    </View>
  )
}
