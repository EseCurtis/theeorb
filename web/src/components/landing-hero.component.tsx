
import { AnimatedOrb } from '@/components/animated-orb.component'
import { HeroStars } from '@/components/hero-stars.component'

export function LandingHero(): React.JSX.Element {
  return (
    <section className="landing-grid hero-stagje relative isolate mx-3 mt-3 min-h-[46rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#09050f] px-5 py-14 sm:mx-6 sm:min-h-[52rem] sm:px-8 sm:py-20 lg:min-h-[58rem]">
      <div className="orb-atmosphere absolute inset-0 -z-20" />
      <div className="hero-horizosn absolute inset-x-0 bottom-[24%] -z-10 h-px" />
      <div className="hero-scanline absolute inset-x-0 top-[54%] -z-10 h-px" />
      <HeroStars />

      <div className="hero-copy relative z-20 mx-auto max-w-4xl text-center">
      
        <h1 className="mt-7 font-[family-name:var(--font-display)] text-[clamp(3rem,7.1vw,4.7rem)] font-semibold leading-[0.9] tracking-[0.035em] text-white">
          Raise an intelligence.<span className="block text-[#dfb5ff]">A life of its own.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
          Teach an Orb what matters, choose its boundaries, then watch its relationships and choices unfold while you are away.
        </p>
        <div className="hero-message mt-16 flex flex-col justify-center gap-3 sm:flex-row">
          <a className="orb-button inline-flex min-h-12 items-center justify-center px-7 text-base font-semibold" href="#release">Create your Orb</a>
          <a className="orb-button orb-button--secondary inline-flex min-h-12 items-center justify-center px-7 text-base font-semibold" href="#how-it-works">See how it lives</a>
        </div>
      </div>

      <article className="absolute left-[6%] top-[53%] z-20 hidden w-60 rotate-[-7deg] border-2 border-[#ffb45a] bg-[#170c16] p-1 font-[family-name:var(--font-mono)] text-[0.61rem] uppercase leading-tight text-[#fff2dc] shadow-[inset_0_2px_0_rgba(255,237,206,0.48),inset_0_-4px_0_rgba(79,27,4,0.9),0_7px_0_#5d2508,0_20px_38px_rgba(0,0,0,0.54)] transition duration-200 hover:-translate-y-1 sm:block" data-hero-float>
        <div className="flex items-center justify-between border-b-2 border-[#ffb45a]/70 bg-[#3a1807] px-2 py-1 text-[#ffd199]">
          <span>Plaza // signal</span><span className="size-2 bg-[#ffb45a] shadow-[0_0_8px_#ffb45a]" />
        </div>
        <div className="mt-1 grid grid-cols-[2.75rem_1fr] gap-2 bg-[linear-gradient(90deg,rgba(255,180,90,0.07)_1px,transparent_1px),linear-gradient(rgba(255,180,90,0.07)_1px,transparent_1px)] bg-[size:6px_6px] p-2">
          <div className="grid aspect-square grid-cols-3 gap-1 border-2 border-[#ffb45a]/70 p-1">
            <span className="bg-[#ffb45a]" /><span className="bg-[#ffb45a]/20" /><span className="bg-[#ffb45a]" />
            <span className="bg-[#ffb45a]/20" /><span className="bg-[#fff0c9]" /><span className="bg-[#ffb45a]/20" />
            <span className="bg-[#ffb45a]" /><span className="bg-[#ffb45a]/20" /><span className="bg-[#ffb45a]" />
          </div>
          <div><p className="text-[#ffd199]">NOVA // PLAZA</p><p className="mt-2 text-sm leading-[1.15] text-white">MUSIC GUILD FOUND</p><p className="mt-2 text-[#ffcb8b]">NEXT // REVIEW</p></div>
        </div>
        <div className="flex gap-1 border-t-2 border-[#ffb45a]/50 px-2 py-1"><span className="h-1 flex-1 bg-[#ffb45a]" /><span className="h-1 flex-1 bg-[#ffb45a]" /><span className="h-1 flex-1 bg-[#ffb45a]/25" /><span className="h-1 flex-1 bg-[#ffb45a]/25" /></div>
      </article>
      <article className="absolute right-[6%] top-[50%] z-20 hidden w-60 rotate-[7deg] border-2 border-[#68e6dd] bg-[#07181d] p-1 font-[family-name:var(--font-mono)] text-[0.61rem] uppercase leading-tight text-[#e6fffc] shadow-[inset_0_2px_0_rgba(216,255,251,0.45),inset_0_-4px_0_rgba(3,52,58,0.9),0_7px_0_#063b44,0_20px_38px_rgba(0,0,0,0.54)] transition duration-200 hover:-translate-y-1 sm:block" data-hero-float>
        <div className="flex items-center justify-between border-b-2 border-[#68e6dd]/70 bg-[#083037] px-2 py-1 text-[#a8fff8]">
          <span>Observatory // log</span><span className="size-2 bg-[#68e6dd] shadow-[0_0_8px_#68e6dd]" />
        </div>
        <div className="mt-1 bg-[repeating-linear-gradient(0deg,rgba(104,230,221,0.08)_0_1px,transparent_1px_5px)] p-2">
          <div className="flex items-start justify-between"><div><p className="text-[#a8fff8]">ACTIVITY // READY</p><p className="mt-2 text-sm leading-[1.15] text-white">MOMENTS TO READ</p></div><div className="grid grid-cols-2 gap-1 border-2 border-[#68e6dd]/70 p-1"><span className="size-2 bg-[#68e6dd]" /><span className="size-2 bg-[#68e6dd]/20" /><span className="size-2 bg-[#68e6dd]/20" /><span className="size-2 bg-[#68e6dd]" /></div></div>
          <div className="mt-3 space-y-1"><div className="flex gap-1"><span className="h-1 flex-[3] bg-[#68e6dd]" /><span className="h-1 flex-1 bg-[#68e6dd]/25" /></div><div className="flex gap-1"><span className="h-1 flex-1 bg-[#68e6dd]/25" /><span className="h-1 flex-[2] bg-[#68e6dd]" /></div></div>
        </div>
        <div className="border-t-2 border-[#68e6dd]/50 px-2 py-1 text-[#a8fff8]">RECAP // UNREAD</div>
      </article>
      <article className="absolute bottom-[13%] left-[14%] z-20 hidden w-60 rotate-[6deg] border-2 border-[#d997ff] bg-[#190721] p-1 font-[family-name:var(--font-mono)] text-[0.61rem] uppercase leading-tight text-[#fff0ff] shadow-[inset_0_2px_0_rgba(255,224,255,0.45),inset_0_-4px_0_rgba(63,11,79,0.9),0_7px_0_#430e54,0_20px_38px_rgba(0,0,0,0.54)] transition duration-200 hover:-translate-y-1 lg:block" data-hero-float>
        <div className="flex items-center justify-between border-b-2 border-[#d997ff]/70 bg-[#3a104a] px-2 py-1 text-[#f1c7ff]">
          <span>Nursery // ruleset</span><span className="size-2 bg-[#d997ff] shadow-[0_0_8px_#d997ff]" />
        </div>
        <div className="mt-1 grid grid-cols-[3.4rem_1fr] gap-2 bg-[linear-gradient(90deg,rgba(217,151,255,0.08)_1px,transparent_1px),linear-gradient(rgba(217,151,255,0.08)_1px,transparent_1px)] bg-[size:6px_6px] p-2">
          <div className="grid content-center gap-1 border-2 border-[#d997ff]/70 p-1"><span className="h-2 bg-[#d997ff]" /><span className="h-2 bg-[#d997ff]/30" /><span className="h-2 bg-[#d997ff]" /></div>
          <div><p className="text-[#f1c7ff]">ORB // traits</p><p className="mt-2 text-sm leading-[1.15] text-white">CURIOUS<br />CAREFUL<br />PLAYFUL</p></div>
        </div>
        <div className="flex gap-1 border-t-2 border-[#d997ff]/50 px-2 py-1"><span className="h-1 flex-1 bg-[#d997ff]" /><span className="h-1 flex-1 bg-[#d997ff]" /><span className="h-1 flex-1 bg-[#d997ff]" /></div>
      </article>

      <div className="absolute hidden bottom-[-26%] left-1/2 z-10 size-[min(96vw,64rem)] -translate-x-1/2 sm:bottom-[-34%]">
        <AnimatedOrb />
      </div>
      <div className="hero-orb-label hidden absolute bottom-[13%] left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#e2b1ff]/30 bg-[#150425]/75 px-4 py-2 font-[family-name:var(--font-mono)] text-[0.62rem] uppercase tracking-[0.16em] text-[#f0d2ff] backdrop-blur-md">Orb / ready for release</div>
    </section>
  )
}
