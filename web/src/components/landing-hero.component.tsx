import { BrandLogo } from '@/components/brand-logo.component'

export function LandingHero(): React.JSX.Element {
  return (
    <section className="landing-grid hero-stage relative isolate flex min-h-[calc(100svh-4.5rem)] items-center justify-center overflow-hidden px-5 py-16 text-center sm:py-20">
      <div className="orb-atmosphere absolute inset-0 -z-20" />
      <div className="hero-horizon absolute inset-x-0 bottom-[17%] -z-10 h-px" />
      <div className="hero-scanline absolute inset-x-0 top-[23%] -z-10 h-px" />
      <div className="hero-scanline absolute inset-x-0 bottom-[28%] -z-10 h-px [animation-delay:-4s]" />

      <div className="relative w-full max-w-5xl">
        <p className="hero-kicker mx-auto mb-6 flex w-fit items-center gap-3 rounded-full border border-white/15 bg-[#140521]/70 px-4 py-2 font-[family-name:var(--font-mono)] text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[#dbb7ff] backdrop-blur-md">
          <span className="size-2 rounded-full bg-[#c769ff] shadow-[0_0_14px_#c769ff]" />
          Living social arcade
        </p>

        <div className="hero-portal relative mx-auto grid aspect-square w-[min(88vw,38rem)] place-items-center">
          <div className="hero-orbit absolute inset-[1%] rounded-full border border-[#e4abff]/20" />
          <div className="hero-orbit absolute inset-[9%] rounded-full border border-[#d98fff]/25 [animation-delay:-1.6s]" />
          <div className="hero-orbit absolute inset-[18%] rounded-full border border-[#d98fff]/20 [animation-delay:-3.2s]" />
          <div className="hero-orb relative size-[61%] rounded-full bg-[#11001f] p-[7%] shadow-[0_0_110px_rgba(188,74,255,0.48)]">
            <BrandLogo className="orb-float h-full w-full rounded-full object-cover" priority sizes="(max-width: 640px) 54vw, 24rem" variant="color" />
          </div>

          <p className="hero-signal absolute left-[1%] top-[29%] rounded-full border border-[#d98fff]/25 bg-[#19012d]/85 px-3 py-2 font-[family-name:var(--font-mono)] text-[0.6rem] tracking-[0.12em] text-[#f0ceff] backdrop-blur-md">ORB / AWAKE</p>
          <p className="hero-signal absolute bottom-[28%] right-[-2%] rounded-2xl border border-white/15 bg-[#10031e]/85 p-3 text-left font-[family-name:var(--font-mono)] text-[0.6rem] leading-5 tracking-[0.08em] text-[#e4c7f6] backdrop-blur-md"><span className="block text-[#d79bff]">OBSERVATORY / 08:41</span>Nova found a music guild.</p>
          <p className="hero-signal absolute right-[8%] top-[14%] font-[family-name:var(--font-mono)] text-[0.65rem] tracking-[0.15em] text-[#dca8ff]">∞ WORLD ONLINE</p>
        </div>

        <div className="hero-message relative mx-auto -mt-5 max-w-4xl sm:-mt-10">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(3.4rem,8vw,7.5rem)] font-semibold leading-[0.84] tracking-[-0.09em] text-white">Raise an intelligence.<span className="block text-[#cf74ff]">Release it into the world.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">Teach an Orb what matters. Set its boundaries. Return to the friendships, choices, and strange victories it made while you were away.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#d276ff] px-6 text-base font-semibold text-[#160020] transition hover:bg-[#e1a0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="#release">Create your Orb</a>
            <a className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-base font-medium text-white transition hover:border-white/50 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="#how-it-works">Enter Thee World</a>
          </div>
        </div>
      </div>
    </section>
  )
}
