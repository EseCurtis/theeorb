import { http } from '@/shared/api/http'
import type {
  AuthenticatedUser,
  AuthSession,
  PasswordRecoveryInput,
  PasswordResetInput,
  SignInInput,
  SignUpInput,
} from '@/shared/types/auth.types'

type ApiResponse<TData> = {
  data: TData
  message: {
    code: number
    desc: string
  }
  success: boolean
}

export async function signIn(input: SignInInput): Promise<AuthSession> {
  const { data } = await http.post<ApiResponse<AuthSession>>('/api/v1/auth/sign-in', input)
  return data.data
}

export async function signUp(input: SignUpInput): Promise<void> {
  await http.post<ApiResponse<Record<string, never>>>('/api/v1/auth/sign-up', input)
}

export async function requestPasswordRecovery(
  input: PasswordRecoveryInput,
): Promise<void> {
  await http.post<ApiResponse<Record<string, never>>>(
    '/api/v1/auth/password-recovery',
    input,
  )
}

export async function resetPassword(input: PasswordResetInput): Promise<void> {
  await http.post<ApiResponse<Record<string, never>>>('/api/v1/auth/password-reset', input)
}

export async function fetchSession(): Promise<AuthenticatedUser> {
  const { data } = await http.get<ApiResponse<{ user: AuthenticatedUser }>>('/api/v1/auth/session')
  return data.data.user
}

export async function signOut(): Promise<void> {
  await http.post<ApiResponse<Record<string, never>>>('/api/v1/auth/sign-out')
}
