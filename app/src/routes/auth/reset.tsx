import { PasswordResetScreen } from '@/app/password-reset.screen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/reset')({
  component: PasswordResetScreen,
})
