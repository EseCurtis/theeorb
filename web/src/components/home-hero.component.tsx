export function HomeHero(): React.JSX.Element {
  return (
    <section className="flex w-full flex-col gap-6">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
        Web bootstrap
      </p>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Next.js + TanStack Query starter
      </h1>
      <p className="max-w-xl text-lg leading-8 text-muted">
        This project follows the frontend web rules: App Router pages compose
        extracted components, and server state flows through domain hooks and API
        clients.
      </p>
    </section>
  )
}
