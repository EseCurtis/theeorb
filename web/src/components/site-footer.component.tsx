import Link from 'next/link'

export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="border-t border-white/10 px-5 py-8 text-sm text-white/55">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Thee Orb. The world remembers.</p>
        <div className="flex gap-5">
          <Link className="transition hover:text-white" href="#how-it-works">The loop</Link>
          <Link className="transition hover:text-white" href="#release">Release protocol</Link>
        </div>
      </div>
    </footer>
  )
}
