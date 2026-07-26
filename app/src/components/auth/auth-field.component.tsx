import type { InputHTMLAttributes } from 'react'

import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { cn } from '@/shared/utils/helpers.util'

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  readonly label: string
}

export function AuthField({
  className,
  label,
  required,
  ...inputProps
}: AuthFieldProps): React.JSX.Element {
  return (
    <View className="gap-2.5">
      <label className="flex flex-col gap-2.5">
        <View className="flex-row items-center justify-between">
          <Text className="font-[family-name:var(--font-pixel)] text-[0.66rem] tracking-[0.07em] text-[#e5b6ff]">
            {label}
          </Text>
          {required ? (
            <Text className="font-[family-name:var(--font-pixel)] text-[0.5rem] tracking-[0.06em] text-[#a884ba]">
              REQUIRED
            </Text>
          ) : null}
        </View>
        <View className="border-2 border-[#6f3a91] bg-[#08030e] p-1 shadow-[inset_0_2px_0_rgba(249,218,254,0.18),inset_0_-4px_0_rgba(25,5,39,0.95),0_4px_0_#210a34] transition-colors duration-200 focus-within:border-[#e5b6ff] focus-within:shadow-[inset_0_2px_0_rgba(249,218,254,0.3),inset_0_-4px_0_rgba(25,5,39,0.95),0_4px_0_#210a34,0_0_18px_rgba(193,107,255,0.22)]">
          <input
            className={cn(
              'min-h-12 w-full rounded-none border border-white/10 bg-[#13081d] px-3 text-base text-[var(--foreground)] caret-[#e5b6ff] outline-none placeholder:text-[#9c80ab] focus:border-[#d999ff]/55',
              className,
            )}
            required={required}
            {...inputProps}
          />
        </View>
      </label>
    </View>
  )
}
