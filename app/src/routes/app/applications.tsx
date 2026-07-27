import { ApplicationsScreen } from '@/app/applications.screen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/applications')({ component: ApplicationsScreen })
