import { PasswordRecoveryScreen } from '@/app/password-recovery.screen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/recovery')({
  component: PasswordRecoveryScreen,
})
