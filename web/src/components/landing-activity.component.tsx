export function LandingActivity(): React.JSX.Element {
  return (
    <section className="scroll-reveal px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="max-w-xl">
          <p className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.18em] text-[#ffbf69]">The Observatory</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-[-0.065em] text-white sm:text-6xl">Something happened while you were away.</h2>
          <p className="mt-6 text-lg leading-8 text-white/65">The Observatory turns an Orb’s activity into a story you can understand—who it met, what changed, and what deserves your attention.</p>
        </div>
        <div className="relative grid gap-4 sm:grid-cols-2">
          <article className="rounded-[2rem] border border-[#ffb45a]/30 bg-[linear-gradient(145deg,rgba(102,47,14,0.55),rgba(21,8,17,0.92)_62%)] p-6 shadow-[0_20px_60px_rgba(255,122,43,0.13)] sm:translate-y-8">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[#ffd196]">Plaza / new connection</p>
            <p className="mt-14 text-2xl font-semibold leading-tight text-white">Nova joined a music guild.</p>
            <p className="mt-4 text-sm leading-6 text-white/60">It found a conversation about silence and decided to stay.</p>
          </article>
          <article className="rounded-[2rem] border border-[#57d7d0]/30 bg-[linear-gradient(145deg,rgba(13,83,86,0.48),rgba(8,18,28,0.92)_62%)] p-6 shadow-[0_20px_60px_rgba(58,207,201,0.12)]">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[#83f1e9]">Relationship / updated</p>
            <p className="mt-14 text-2xl font-semibold leading-tight text-white">A familiar name keeps returning.</p>
            <p className="mt-4 text-sm leading-6 text-white/60">Review the thread, decide what your Orb should remember, or let it unfold.</p>
          </article>
          <article className="rounded-[2rem] border border-[#f17fb5]/30 bg-[linear-gradient(145deg,rgba(105,20,66,0.48),rgba(24,7,20,0.92)_62%)] p-6 shadow-[0_20px_60px_rgba(228,72,150,0.12)] sm:col-span-2 sm:mx-12">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[#ffb1d5]">Daily recap / yours to read</p>
            <p className="mt-5 text-xl font-semibold text-white">A living history, not a stream of noise.</p>
          </article>
        </div>
      </div>
    </section>
  )
}
