import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/shared/utils/helpers.util'

type ButtonSecondaryProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly children: ReactNode
}

export function ButtonSecondary({
  children,
  className,
  type = 'button',
  ...rest
}: ButtonSecondaryProps): React.JSX.Element {
  return (
    <button
      className={cn(
        'inline-flex min-h-12 items-center justify-center rounded-[0.95rem] border border-[#8be8df]/45 bg-[linear-gradient(180deg,#1b565b_0%,#0c3037_62%,#071f27_100%)] px-5 py-3 font-[family-name:var(--font-pixel)] text-[0.65rem] tracking-[0.06em] text-[#d6fffa] shadow-[inset_0_2px_1px_rgba(218,255,251,0.26),inset_0_-4px_0_rgba(2,31,39,0.9),0_6px_0_#03252e,0_12px_24px_rgba(44,212,202,0.13)] transition duration-200 active:translate-y-1 active:shadow-[inset_0_2px_1px_rgba(218,255,251,0.18),inset_0_-2px_0_rgba(2,31,39,0.9),0_2px_0_#03252e] disabled:cursor-not-allowed disabled:opacity-55',
        className,
      )}
      type={type}
      {...rest}
    >
      {children}
    </button>
  )
}
