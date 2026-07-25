import Link from 'next/link'

import { BrandLogo } from '@/components/brand-logo.component'

export function SiteHeader(): React.JSX.Element {
  return (
    <header className="relative z-20 border-b border-white/10 bg-[#07040f]/70 px-5 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link className="flex items-center gap-3" href="/">
          <span className="grid size-9 place-items-center overflow-hidden rounded-full border border-white/15 bg-[#190036] shadow-[0_0_22px_rgba(171,65,255,0.45)]">
            <BrandLogo className="size-full max-w-none" priority variant="color" />
          </span>
          <span className="font-[family-name:var(--font-display)] text-base font-semibold tracking-[-0.04em] text-white">THEE ORB</span>
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center gap-5">
          <Link className="hidden text-sm text-white/65 transition hover:text-white sm:block" href="#how-it-works">The loop</Link>
          <Link className="orb-button px-4 py-2 text-sm font-semibold" href="#release">Enter the Nursery</Link>
        </nav>
      </div>
    </header>
  )
}
