import type { ReactNode } from 'react'

import { View } from '@/components/layout/view.component'
import { Text } from '@/components/layout/text.component'
import { cn } from '@/shared/utils/helpers.util'

type PanelProps = {
  readonly children: ReactNode
  readonly label: string
  readonly tone?: 'amber' | 'cyan' | 'pink' | 'violet'
  readonly variant?: 'arcade' | 'quiet'
}

const toneClasses = {
  amber: {
    border: 'border-[#ffb45a]/80',
    footer: 'bg-[#ffb45a]',
    header: 'border-[#ffb45a]/70 bg-[#4b2008] text-[#ffd199]',
    matrix: 'bg-[#ffb45a]',
    shadow:
      'shadow-[inset_0_2px_0_rgba(255,239,207,0.3),inset_0_-4px_0_rgba(67,22,3,0.9),0_7px_0_#4c1d04,0_20px_40px_rgba(0,0,0,0.34)]',
    surface: 'bg-[#211108]',
  },
  cyan: {
    border: 'border-[#6ce4dc]/80',
    footer: 'bg-[#6ce4dc]',
    header: 'border-[#6ce4dc]/70 bg-[#0a4147] text-[#b7fffa]',
    matrix: 'bg-[#6ce4dc]',
    shadow:
      'shadow-[inset_0_2px_0_rgba(218,255,252,0.3),inset_0_-4px_0_rgba(2,47,53,0.9),0_7px_0_#04363d,0_20px_40px_rgba(0,0,0,0.34)]',
    surface: 'bg-[#061b20]',
  },
  pink: {
    border: 'border-[#ff85b7]/80',
    footer: 'bg-[#ff85b7]',
    header: 'border-[#ff85b7]/70 bg-[#4c082a] text-[#ffd0e4]',
    matrix: 'bg-[#ff85b7]',
    shadow:
      'shadow-[inset_0_2px_0_rgba(255,225,239,0.3),inset_0_-4px_0_rgba(66,4,36,0.9),0_7px_0_#4c082a,0_20px_40px_rgba(0,0,0,0.34)]',
    surface: 'bg-[#260918]',
  },
  violet: {
    border: 'border-[#d997ff]/80',
    footer: 'bg-[#d997ff]',
    header: 'border-[#d997ff]/70 bg-[#350b4a] text-[#f0caff]',
    matrix: 'bg-[#d997ff]',
    shadow:
      'shadow-[inset_0_2px_0_rgba(255,225,255,0.3),inset_0_-4px_0_rgba(42,4,62,0.9),0_7px_0_#310443,0_20px_40px_rgba(0,0,0,0.34)]',
    surface: 'bg-[#170521]',
  },
} as const

export function Panel({ children, label, tone = 'violet', variant = 'quiet' }: PanelProps): React.JSX.Element {
  const panelTone = toneClasses[tone]

  if (variant === 'quiet') {
    return (
      <View className={cn('gap-4 rounded-[1.5rem] border p-5 shadow-[0_18px_44px_rgba(0,0,0,0.2)]', panelTone.border, panelTone.surface)}>
        <Text className={cn('text-[0.6rem] tracking-[0.08em]', panelTone.header)}>{label}</Text>
        {children}
      </View>
    )
  }

  return (
    <View className={cn('gap-0 border-2 p-1', panelTone.border, panelTone.shadow, panelTone.surface)}>
      <View className={cn('flex-row items-center justify-between border-b-2 px-2 py-1', panelTone.header)}>
        <Text className="font-[family-name:var(--font-pixel)] text-[0.58rem] tracking-[0.07em]">{label}</Text>
        <View aria-hidden="true" className="grid grid-cols-2 gap-1">
          <View className={cn('size-1.5', panelTone.matrix)} />
          <View className={cn('size-1.5 opacity-30', panelTone.matrix)} />
          <View className={cn('size-1.5', panelTone.matrix)} />
          <View className={cn('size-1.5', panelTone.matrix)} />
        </View>
      </View>
      <View className="gap-4 p-5">{children}</View>
      <View aria-hidden="true" className="flex-row gap-1 border-t-2 border-white/10 px-2 py-1">
        <View className={cn('h-1 flex-1', panelTone.footer)} />
        <View className={cn('h-1 flex-1 opacity-35', panelTone.footer)} />
        <View className={cn('h-1 flex-1 opacity-35', panelTone.footer)} />
      </View>
    </View>
  )
}
