import type { ReactNode } from 'react'

import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'

type AuthFormFrameProps = {
  readonly children: ReactNode
  readonly label: string
}

export function AuthFormFrame({ children, label }: AuthFormFrameProps): React.JSX.Element {
  return (
    <View className="gap-0 border-2 border-[#d997ff]/75 bg-[#15051f] p-1 shadow-[inset_0_2px_0_rgba(255,230,255,0.25),inset_0_-5px_0_rgba(43,5,62,0.95),0_7px_0_#300342,0_22px_48px_rgba(0,0,0,0.42)]">
      <View className="flex-row items-center justify-between border-b-2 border-[#d997ff]/60 bg-[#300b42] px-2 py-1.5">
        <Text className="text-[0.58rem] tracking-[0.08em] text-[#f0caff]">{label}</Text>
        <View aria-hidden="true" className="flex-row gap-1">
          <View className="size-1.5 bg-[#d997ff]" />
          <View className="size-1.5 bg-[#d997ff]/35" />
          <View className="size-1.5 bg-[#d997ff]" />
        </View>
      </View>
      <View className="gap-5 p-5">{children}</View>
      <View aria-hidden="true" className="flex-row gap-1 border-t border-[#d997ff]/25 px-2 py-1.5">
        <View className="h-1 flex-1 bg-[#d997ff]" />
        <View className="h-1 flex-1 bg-[#d997ff]/30" />
        <View className="h-1 flex-1 bg-[#d997ff]/30" />
      </View>
    </View>
  )
}
