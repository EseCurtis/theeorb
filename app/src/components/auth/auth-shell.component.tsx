import type { ReactNode } from 'react'

import { BrandLogo } from '@/components/brand/brand-logo.component'
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
      <View className="pointer-events-none absolute -right-20 top-16 size-64 rounded-full bg-[#8c2ce6]/20 blur-3xl" />
      <View className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full bg-[#ef8f32]/10 blur-3xl" />
      <View aria-hidden="true" className="pointer-events-none absolute left-[8%] top-[23%] size-1 bg-[#e7b2ff]/70 shadow-[0_0_10px_#d887ff]" />
      <View aria-hidden="true" className="pointer-events-none absolute right-[12%] top-[34%] size-1.5 bg-[#72e7df]/70 shadow-[0_0_10px_#72e7df]" />
      <View aria-hidden="true" className="pointer-events-none absolute bottom-[19%] right-[20%] size-1 bg-[#ffc56c]/75 shadow-[0_0_10px_#ffc56c]" />
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
