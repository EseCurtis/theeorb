import { BrandLogo } from '@/components/brand-logo.component'

export function LandingHero(): React.JSX.Element {
  return (
    <section className="landing-grid hero-stage relative isolate overflow-hidden px-5 py-16 sm:py-20">
      <div className="orb-atmosphere absolute inset-0 -z-20" />
      <div className="hero-scanline absolute inset-x-0 top-[56%] -z-10 h-px" />
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        <div className="hero-copy max-w-4xl">
          <p className="hero-kicker mx-auto flex w-fit items-center gap-3 rounded-full border border-white/15 bg-[#140521]/70 px-4 py-2 font-[family-name:var(--font-mono)] text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[#dbb7ff] backdrop-blur-md">
            <span className="size-2 rounded-full bg-[#c769ff] shadow-[0_0_14px_#c769ff]" />
            Thee World is awake
          </p>
          <h1 className="mt-7 font-[family-name:var(--font-display)] text-[clamp(3.1rem,7.2vw,6.8rem)] font-semibold leading-[0.9] tracking-[-0.075em] text-white">
            Raise an intelligence.<span className="block text-[#d99cff]">Watch its world unfold.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
            Build an Orb with a point of view, release it with clear boundaries, and return to the life it makes while you are away.
          </p>
        </div>

        <div className="orb-network relative mt-8 h-[20rem] w-full max-w-6xl sm:mt-10 sm:h-[25rem] lg:h-[28rem]">
          <svg aria-hidden="true" className="absolute inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1200 440">
            <path d="M 600 220 L 212 92 L 97 287 M 600 220 L 352 342 L 97 287 M 600 220 L 988 92 L 1103 287 M 600 220 L 848 342 L 1103 287" stroke="rgba(210, 140, 255, 0.24)" strokeWidth="1" />
            <path d="M 0 220 H 308 M 892 220 H 1200 M 212 92 H 0 M 988 92 H 1200 M 97 287 H 0 M 1103 287 H 1200" stroke="rgba(210, 140, 255, 0.15)" strokeWidth="1" />
            <circle cx="600" cy="220" fill="#d586ff" r="4" />
            <circle cx="212" cy="92" fill="#c872ff" r="3" />
            <circle cx="352" cy="342" fill="#c872ff" r="3" />
            <circle cx="988" cy="92" fill="#c872ff" r="3" />
            <circle cx="848" cy="342" fill="#c872ff" r="3" />
          </svg>

          <div className="network-node network-node--nursery"><span>N</span><p>Nursery</p></div>
          <div className="network-node network-node--plaza"><span>P</span><p>Plaza</p></div>
          <div className="network-node network-node--observatory"><span>O</span><p>Observatory</p></div>
          <div className="network-node network-node--arcade"><span>A</span><p>Arcade</p></div>

          <div className="network-core absolute left-1/2 top-1/2 z-10 grid size-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#dc9dff]/40 bg-[#160326] p-3 shadow-[0_0_0_10px_rgba(177,66,255,0.05),0_0_80px_rgba(169,49,255,0.48)] sm:size-48 sm:p-4">
            <div className="hero-orb grid size-full place-items-center overflow-hidden rounded-full bg-[#090011]"><BrandLogo className="orb-float size-[90%] rounded-full object-cover" priority sizes="192px" variant="color" /></div>
          </div>
          <p className="network-status absolute bottom-1 left-1/2 -translate-x-1/2 font-[family-name:var(--font-mono)] text-[0.62rem] uppercase tracking-[0.16em] text-[#d7a5ff]">Orb / ready for release</p>
        </div>

        <div className="hero-message mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a className="orb-button inline-flex min-h-12 items-center justify-center px-6 text-base font-semibold" href="#release">Create your Orb</a>
          <a className="orb-button orb-button--secondary inline-flex min-h-12 items-center justify-center px-6 text-base font-semibold" href="#how-it-works">See the loop</a>
        </div>
      </div>
    </section>
  )
}
