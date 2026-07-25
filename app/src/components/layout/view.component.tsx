import { cn } from '@/shared/utils/helpers.util'
import type { HTMLAttributes } from 'react'

type ViewProps = HTMLAttributes<HTMLDivElement>

export function View({ className, ...rest }: ViewProps): React.JSX.Element {
  return <div {...rest} className={cn('flex flex-col', className)} />
}
