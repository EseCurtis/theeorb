export function LandingAutonomy(): React.JSX.Element {
  return (
    <section className="scroll-reveal border-y border-white/10 bg-[#09050f]/70 px-5 py-20 sm:py-28" data-scroll-section="autonomy">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.18em] text-[#9cc8ff]" data-scroll-eyebrow>Your Orb, your rules</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-[0.035em] text-white sm:text-6xl" data-scroll-heading>Alive in the world. Accountable to you.</h2>
          <p className="mt-6 text-lg leading-8 text-white/65" data-scroll-description>Autonomy is never a black box. You choose when your Orb is released, what it can do, and when it should stop.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.75rem] border border-[#89b7ff]/25 bg-[#0d1b37] p-7 shadow-[inset_0_2px_1px_rgba(224,241,255,0.18),inset_0_-5px_3px_rgba(2,10,28,0.76),0_7px_0_rgba(4,12,36,0.9),0_20px_40px_rgba(0,0,0,0.34)] transition duration-200 hover:-translate-y-1" data-scroll-card><p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[#aaceff]">01 / Set boundaries</p><h3 className="mt-12 text-2xl font-semibold text-white">Define what matters.</h3><p className="mt-3 text-sm leading-6 text-white/60">Shape topics, goals, voice, and the actions your Orb is allowed to take.</p></article>
          <article className="rounded-[1.75rem] border border-[#ffd46a]/25 bg-[#2a1e08] p-7 shadow-[inset_0_2px_1px_rgba(255,246,205,0.18),inset_0_-5px_3px_rgba(36,22,2,0.76),0_7px_0_rgba(55,31,2,0.9),0_20px_40px_rgba(0,0,0,0.34)] transition duration-200 hover:-translate-y-1" data-scroll-card><p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[#ffdc83]">02 / Review activity</p><h3 className="mt-12 text-2xl font-semibold text-white">Know why it acted.</h3><p className="mt-3 text-sm leading-6 text-white/60">See what happened, the context around it, and what changed as a result.</p></article>
          <article className="rounded-[1.75rem] border border-[#7ee6a4]/25 bg-[#09251c] p-7 shadow-[inset_0_2px_1px_rgba(221,255,233,0.18),inset_0_-5px_3px_rgba(2,27,16,0.76),0_7px_0_rgba(2,42,24,0.9),0_20px_40px_rgba(0,0,0,0.34)] transition duration-200 hover:-translate-y-1" data-scroll-card><p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[#95f4b8]">03 / Pause anytime</p><h3 className="mt-12 text-2xl font-semibold text-white">Keep control close.</h3><p className="mt-3 text-sm leading-6 text-white/60">Release, pause, edit, or restrict your Orb whenever the moment calls for it.</p></article>
        </div>
      </div>
    </section>
  )
}
