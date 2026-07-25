import type { ButtonHTMLAttributes, ReactNode } from 'react'

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
      className={[
        'inline-flex min-h-12 items-center justify-center rounded-[0.95rem] bg-[var(--surface-muted)] px-5 py-3 text-sm font-semibold text-[var(--foreground)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      type={type}
      {...rest}
    >
      {children}
    </button>
  )
}
