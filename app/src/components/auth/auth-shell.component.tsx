import type { ReactNode } from 'react'

import { BrandLogo } from '@/components/brand/brand-logo.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'

type AuthShellProps = {
  readonly children: ReactNode
  readonly description: string
  readonly title: string
}

export function AuthShell({
  children,
  description,
  title,
}: AuthShellProps): React.JSX.Element {
  return (
    <View className="relative min-h-dvh overflow-hidden bg-[var(--background)] px-[calc(1.25rem+var(--safe-area-inset-left))] pb-[calc(2rem+var(--safe-area-inset-bottom))] pr-[calc(1.25rem+var(--safe-area-inset-right))] pt-[calc(1.5rem+var(--safe-area-inset-top))]">
      <View className="pointer-events-none absolute -right-24 top-16 size-72 rounded-full bg-[#8c2ce6]/25 blur-3xl" />
      <View className="pointer-events-none absolute -bottom-28 -left-24 size-72 rounded-full bg-[#ef8f32]/10 blur-3xl" />
      <View className="relative mx-auto w-full max-w-md gap-8">
        <View className="flex-row items-center gap-3">
          <BrandLogo className="size-11 rounded-full" />
          <Text className="font-[family-name:var(--font-pixel)] text-sm tracking-[0.12em] text-[var(--foreground)]">
            THEE ORB
          </Text>
        </View>
        <View className="gap-3">
          <Text className="font-[family-name:var(--font-pixel)] text-3xl leading-tight tracking-[0.07em] text-[var(--foreground)]">
            {title}
          </Text>
          <Text className="max-w-sm text-sm leading-6 text-[var(--muted)]">{description}</Text>
        </View>
        {children}
      </View>
    </View>
  )
}
