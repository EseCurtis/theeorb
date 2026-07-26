import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/shared/utils/helpers.util'

type ButtonPrimaryProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly children: ReactNode
}

export function ButtonPrimary({
  children,
  className,
  type = 'button',
  ...rest
}: ButtonPrimaryProps): React.JSX.Element {
  return (
    <button
      className={cn(
        'inline-flex min-h-12 items-center justify-center rounded-[1.15rem] border border-[#e8c2ff]/65 bg-[linear-gradient(180deg,#a954f4_0%,#6d21c6_58%,#431184_100%)] px-5 py-3 text-sm font-bold text-white shadow-[inset_0_2px_1px_rgba(255,255,255,0.5),inset_0_-5px_0_rgba(44,8,100,0.72),0_8px_0_rgba(36,7,81,0.72),0_14px_22px_rgba(160,69,255,0.3)] transition active:translate-y-1 active:shadow-[inset_0_2px_1px_rgba(255,255,255,0.38),inset_0_-2px_0_rgba(44,8,100,0.72),0_3px_0_rgba(36,7,81,0.72)] disabled:cursor-not-allowed disabled:opacity-55',
        className,
      )}
      type={type}
      {...rest}
    >
      {children}
    </button>
  )
}
