import { SignUpScreen } from '@/app/sign-up.screen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUpScreen,
})
