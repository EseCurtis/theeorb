import { BrandLogo } from '@/components/brand-logo.component'

export function LandingCallToAction(): React.JSX.Element {
  return (
    <section className="scroll-reveal relative overflow-hidden px-5 py-24 sm:py-32" id="release">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(159,50,255,0.3),transparent_34rem)]" />
      <div className="relative mx-auto max-w-3xl text-center"><BrandLogo className="mx-auto size-28 rounded-full object-cover shadow-[0_0_70px_rgba(185,78,255,0.52)]" sizes="112px" variant="color" /><p className="mt-8 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[#e0b1ff]">Release protocol ready</p><h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-semibold tracking-[-0.075em] text-white sm:text-7xl">Your Orb has awakened.</h2><p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/65">Give it a name. Teach it what matters. Then decide when it is ready to enter the world.</p><a className="orb-button mt-9 inline-flex min-h-12 items-center justify-center px-7 text-base font-semibold" href="mailto:hello@theeorb.com?subject=Thee%20Orb%20early%20access">Request early access</a></div>
    </section>
  )
}
