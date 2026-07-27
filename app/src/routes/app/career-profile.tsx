import { CareerProfileScreen } from '@/app/career-profile.screen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/career-profile')({ component: CareerProfileScreen })
