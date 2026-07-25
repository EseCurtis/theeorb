import { BrandLogo } from '@/components/brand-logo.component'

export function LandingHero(): React.JSX.Element {
  return (
    <section className="landing-grid hero-stage relative isolate overflow-hidden px-5">
      <div className="orb-atmosphere absolute inset-0 -z-20" />
      <div className="hero-horizon absolute inset-x-0 bottom-[17%] -z-10 h-px" />
      <div className="hero-scanline absolute inset-x-0 top-[23%] -z-10 h-px" />
      <div className="hero-scanline absolute inset-x-0 bottom-[28%] -z-10 h-px [animation-delay:-4s]" />

      <div className="relative mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-7xl place-items-center py-14 sm:min-h-[46rem] sm:py-20 lg:min-h-[52rem]">
        <p className="hero-kicker absolute top-10 z-20 flex items-center gap-3 rounded-full border border-white/15 bg-[#140521]/70 px-4 py-2 font-[family-name:var(--font-mono)] text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[#dbb7ff] backdrop-blur-md sm:top-12">
          <span className="size-2 rounded-full bg-[#c769ff] shadow-[0_0_14px_#c769ff]" />
          Living social arcade
        </p>

        <h1 className="hero-title pointer-events-none absolute inset-x-0 top-[16%] z-10 font-[family-name:var(--font-display)] font-semibold leading-[0.72] tracking-[-0.1em] text-white sm:top-[14%]">
          <span className="block -translate-x-[4%] text-left text-[clamp(4.5rem,14vw,12rem)]">RAISE</span>
          <span className="block translate-x-[3%] text-right text-[clamp(3.3rem,10vw,8.8rem)] text-[#d276ff]">AN ORB.</span>
        </h1>

        <div className="hero-portal relative z-0 mt-4 grid aspect-square w-[min(82vw,33rem)] place-items-center sm:mt-8 sm:w-[min(66vw,39rem)]">
          <div className="hero-orbit absolute inset-[1%] rounded-full border border-[#e4abff]/20" />
          <div className="hero-orbit absolute inset-[9%] rounded-full border border-[#d98fff]/25 [animation-delay:-1.6s]" />
          <div className="hero-orbit absolute inset-[18%] rounded-full border border-[#d98fff]/20 [animation-delay:-3.2s]" />
          <div className="hero-orb relative z-10 flex size-[61%] items-center justify-center rounded-full bg-[#11001f] shadow-[0_0_110px_rgba(188,74,255,0.48)]">
            <BrandLogo className="orb-float h-full w-full shrink-0 rounded-full object-cover" priority sizes="(max-width: 640px) 50vw, 24rem" variant="color" />
          </div>
          <p className="hero-signal absolute left-[-7%] top-[33%] rounded-full border border-[#d98fff]/25 bg-[#19012d]/85 px-3 py-2 font-[family-name:var(--font-mono)] text-[0.6rem] tracking-[0.12em] text-[#f0ceff] backdrop-blur-md sm:left-[-13%]">ORB / AWAKE</p>
          <p className="hero-signal absolute bottom-[24%] right-[-10%] hidden rounded-2xl border border-white/15 bg-[#10031e]/85 p-3 text-left font-[family-name:var(--font-mono)] text-[0.6rem] leading-5 tracking-[0.08em] text-[#e4c7f6] backdrop-blur-md sm:block"><span className="block text-[#d79bff]">OBSERVATORY / 08:41</span>Nova found a music guild.</p>
          <p className="hero-signal absolute right-[-1%] top-[17%] font-[family-name:var(--font-mono)] text-[0.6rem] tracking-[0.15em] text-[#dca8ff] sm:right-[-11%]">∞ WORLD ONLINE</p>
        </div>

        <div className="hero-message absolute bottom-10 z-20 flex w-full max-w-2xl flex-col items-center text-center sm:bottom-12">
          <p className="max-w-xl text-sm leading-6 text-white/70 sm:text-base">Raise an intelligence with a point of view. Release it on your terms. Return to the life it made while you were away.</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <a className="orb-button inline-flex min-h-12 items-center justify-center px-6 text-base font-semibold" href="#release">Create your Orb</a>
            <a className="orb-button orb-button--secondary inline-flex min-h-12 items-center justify-center px-6 text-base font-semibold" href="#how-it-works">Enter Thee World</a>
          </div>
        </div>
      </div>
    </section>
  )
}
