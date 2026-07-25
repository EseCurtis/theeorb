import Link from 'next/link'

export function SiteHeader(): React.JSX.Element {
  return (
    <header className="border-b border-border px-5 py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link className="text-lg font-bold" href="/">
          Starter
        </Link>
        <nav className="text-sm font-semibold text-muted">
          <Link className="hover:text-foreground" href="/">
            Home
          </Link>
        </nav>
      </div>
    </header>
  )
}
