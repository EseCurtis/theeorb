import { LandingCallToAction } from '@/components/landing-call-to-action.component'
import { LandingHero } from '@/components/landing-hero.component'
import { LandingStory } from '@/components/landing-story.component'
import { LandingWorld } from '@/components/landing-world.component'

export default function HomePage(): React.JSX.Element {
  return (
    <main>
      <LandingHero />
      <LandingStory />
      <LandingWorld />
      <LandingCallToAction />
    </main>
  )
}
