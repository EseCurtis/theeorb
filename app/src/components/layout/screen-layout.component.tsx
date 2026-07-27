import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'

type ScreenLayoutProps = {
  readonly backLabel?: string
  readonly backTo?: '/app/applications' | '/app/career'
  readonly children: ReactNode
  readonly description?: string
  readonly title: string
}

export function ScreenLayout({
  backLabel = 'Back',
  backTo,
  children,
  description,
  title,
}: ScreenLayoutProps): React.JSX.Element {
  return (
    <View className="min-h-dvh overflow-x-hidden bg-[var(--background)] px-[calc(var(--app-boundary-x)+var(--safe-area-inset-left))] pb-[calc(2rem+var(--safe-area-inset-bottom))] pr-[calc(var(--app-boundary-x)+var(--safe-area-inset-right))] pt-[calc(1.25rem+var(--safe-area-inset-top)+var(--statusbar-clearfix))]">
      <View className="mx-auto flex w-full max-w-[46rem] flex-col gap-6">
        {backTo ? (
          <Link className="inline-flex min-h-11 items-center self-start rounded-full border border-white/10 bg-white/5 px-4 text-[0.7rem] tracking-[0.04em] text-[var(--foreground)]" to={backTo}>
            {`← ${backLabel}`}
          </Link>
        ) : null}
        <View className="gap-2">
          <Text className="font-[family-name:var(--font-pixel)] text-2xl leading-[1.35] tracking-[0.07em] text-[var(--foreground)]">
            {title}
          </Text>
          {description ? (
            <Text className="leading-relaxed text-[var(--muted)]">
              {description}
            </Text>
          ) : null}
        </View>
        {children}
      </View>
    </View>
  )
}
