import { OrbSetupScreen } from '@/app/orb-setup.screen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/nursery')({
  component: OrbSetupScreen,
})
