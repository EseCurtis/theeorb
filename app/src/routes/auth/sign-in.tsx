import { SignInScreen } from '@/app/sign-in.screen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-in')({
  component: SignInScreen,
})
