import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { clearAuthSession, readAuthSession, saveAuthSession } from '@/shared/auth-session.util'
import {
  fetchSession,
  requestPasswordRecovery,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from '@/shared/api/auth.api'
import { setAuthenticationToken } from '@/shared/api/http'
import type {
  AuthSession,
} from '@/shared/types/auth.types'

const authQueryKey = ['auth', 'session'] as const

async function getCurrentSession(): Promise<AuthSession | null> {
  const storedSession = await readAuthSession()

  if (!storedSession) {
    setAuthenticationToken(null)
    return null
  }

  setAuthenticationToken(storedSession.token)

  try {
    const user = await fetchSession()
    return { token: storedSession.token, user }
  } catch (error: unknown) {
    await clearAuthSession()
    setAuthenticationToken(null)
    throw error instanceof Error ? error : new Error('Unable to restore your session')
  }
}

export function useAuth() {
  const queryClient = useQueryClient()
  const sessionQuery = useQuery({
    gcTime: 1000 * 60 * 60,
    queryFn: getCurrentSession,
    queryKey: authQueryKey,
    retry: false,
    staleTime: 1000 * 60 * 15,
  })
  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: async (session) => {
      setAuthenticationToken(session.token)
      await saveAuthSession(session)
      queryClient.setQueryData(authQueryKey, session)
    },
  })
  const signUpMutation = useMutation({ mutationFn: signUp })
  const passwordRecoveryMutation = useMutation({ mutationFn: requestPasswordRecovery })
  const passwordResetMutation = useMutation({ mutationFn: resetPassword })
  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSettled: async () => {
      await clearAuthSession()
      setAuthenticationToken(null)
      queryClient.removeQueries({ queryKey: authQueryKey })
    },
  })

  return {
    isLoadingSession: sessionQuery.isLoading,
    isRequestingRecovery: passwordRecoveryMutation.isPending,
    isResettingPassword: passwordResetMutation.isPending,
    isSigningIn: signInMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    requestPasswordRecovery: passwordRecoveryMutation.mutateAsync,
    requestPasswordRecoveryError: passwordRecoveryMutation.error,
    resetPassword: passwordResetMutation.mutateAsync,
    resetPasswordError: passwordResetMutation.error,
    session: sessionQuery.data,
    sessionError: sessionQuery.error,
    signIn: signInMutation.mutateAsync,
    signInError: signInMutation.error,
    signOut: signOutMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    signUpError: signUpMutation.error,
  }
}
