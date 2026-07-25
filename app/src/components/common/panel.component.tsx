import type { ReactNode } from 'react'

import { View } from '@/components/layout/view.component'

type PanelProps = {
  readonly children: ReactNode
}

export function Panel({ children }: PanelProps): React.JSX.Element {
  return (
    <View className="flex flex-col gap-4 rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
      {children}
    </View>
  )
}
