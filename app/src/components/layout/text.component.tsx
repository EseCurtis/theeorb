import type { HTMLAttributes } from 'react'

type TextProps = HTMLAttributes<HTMLSpanElement>

export function Text({ children, ...rest }: TextProps): React.JSX.Element {
  return <span {...rest}>{children}</span>
}
