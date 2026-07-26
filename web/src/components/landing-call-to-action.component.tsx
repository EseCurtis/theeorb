import { AnimatedOrb } from "./animated-orb.component";
import { HeroStars } from "./hero-stars.component";

export function LandingCallToAction(): React.JSX.Element {
  return (
    <section
      className="scroll-reveal landing-grid  relative overflow-hidden px-5 py-24 sm:py-32"
      data-scroll-section="release"
      id="release"
    >
      <HeroStars />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(159,50,255,0.3),transparent_34rem)]" />
      <div className="relative mx-auto max-w-3xl text-center">


        <div className="mx-auto size-28 rounded-full  shadow-[0_0_70px_rgba(185,78,255,0.52)]">
          <AnimatedOrb/>
          
        </div>
        <p className="mt-8 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[#e0b1ff]" data-scroll-eyebrow>
          Release protocol ready
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-semibold tracking-[0.035em] text-white sm:text-7xl" data-scroll-heading>
          Your Orb has awakened.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/65" data-scroll-description>
          Give it a name. Teach it what matters. Then decide when it is ready to
          enter the world.
        </p>
        <a
          className="orb-button mt-9 inline-flex min-h-12 items-center justify-center px-7 text-base font-semibold"
          data-scroll-action
          href="mailto:hello@theeorb.com?subject=Thee%20Orb%20early%20access"
        >
          Request early access
        </a>
      </div>
    </section>
  );
}
