import type { InputHTMLAttributes } from 'react'

import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { cn } from '@/shared/utils/helpers.util'

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  readonly label: string
}

export function AuthField({ className, label, ...inputProps }: AuthFieldProps): React.JSX.Element {
  return (
    <View className="gap-2">
      <label className="flex flex-col gap-2">
        <Text className="font-[family-name:var(--font-pixel)] text-[0.66rem] tracking-[0.07em] text-[#e5b6ff]">{label}</Text>
        <input
          className={cn(
            'min-h-12 rounded-[0.95rem] border border-[var(--border)] bg-[var(--surface)] px-4 text-base text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[#bd67ff]/30',
            className,
          )}
          {...inputProps}
        />
      </label>
    </View>
  )
}
