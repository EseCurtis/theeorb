export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="border-t border-border px-5 py-6 text-sm text-muted">
      <div className="mx-auto max-w-5xl">
        Copyright {new Date().getFullYear()} Starter
      </div>
    </footer>
  )
}
