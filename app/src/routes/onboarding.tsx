import { OnboardingScreen } from '@/app/onboarding.screen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding')({
  component: OnboardingScreen,
})
