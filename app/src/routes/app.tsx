import { AuthenticatedAppShell } from '@/components/navigation/authenticated-app-shell.component'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app')({
  component: AuthenticatedAppShell,
})
