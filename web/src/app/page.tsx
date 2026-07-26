import { LandingActivity } from '@/components/landing-activity.component'
import { LandingAutonomy } from '@/components/landing-autonomy.component'
import { LandingCallToAction } from '@/components/landing-call-to-action.component'
import { LandingHero } from '@/components/landing-hero.component'
import { LandingStory } from '@/components/landing-story.component'
import { LandingWorld } from '@/components/landing-world.component'

export default function HomePage(): React.JSX.Element {
  return (
    <main>
      <LandingHero />
      <LandingStory />
      <LandingActivity />
      <LandingWorld />
      <LandingAutonomy />
      <LandingCallToAction />
    </main>
  )
}
