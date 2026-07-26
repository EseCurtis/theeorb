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
    <View className="gap-2">
      <label className="flex flex-col gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-[0.6rem] tracking-[0.08em] text-[#e5b6ff]">
            {label}
          </Text>
          {required ? (
            <Text className="text-[0.48rem] tracking-[0.06em] text-[#a884ba]">
              REQ.
            </Text>
          ) : null}
        </View>
        <View className="border border-[#765187] bg-[#0b0610] transition-colors duration-200 focus-within:border-[#e5b6ff] focus-within:bg-[#15091f] focus-within:shadow-[0_0_0_1px_rgba(229,182,255,0.3),0_0_18px_rgba(193,107,255,0.16)]">
          <input
            className={cn(
              'min-h-14 w-full rounded-none border-0 bg-transparent px-4 text-[0.7rem] leading-6 text-[var(--foreground)] caret-[#e5b6ff] outline-none placeholder:text-[#9c80ab]',
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
