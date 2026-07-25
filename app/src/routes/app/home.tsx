import { HomeScreen } from '@/app/home.screen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/home')({
  component: HomeScreen,
})
