import { CareerScreen } from '@/app/career.screen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/career')({ component: CareerScreen })
