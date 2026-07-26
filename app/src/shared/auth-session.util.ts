import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

import type { AuthSession } from '@/shared/types/auth.types'

const AUTH_SESSION_STORAGE_KEY = 'thee-orb-auth-session'

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') {
    return false
  }

  return (
    'token' in value &&
    'user' in value &&
    typeof value.token === 'string' &&
    typeof value.user === 'object' &&
    value.user !== null &&
    'id' in value.user &&
    'email' in value.user &&
    'displayName' in value.user &&
    typeof value.user.id === 'string' &&
    typeof value.user.email === 'string' &&
    typeof value.user.displayName === 'string'
  )
}

function readWebAuthSession(): AuthSession | null {
  const value = localStorage.getItem(AUTH_SESSION_STORAGE_KEY)

  if (!value) {
    return null
  }

  try {
    const parsedValue: unknown = JSON.parse(value)
    return isAuthSession(parsedValue) ? parsedValue : null
  } catch {
    return null
  }
}

export async function readAuthSession(): Promise<AuthSession | null> {
  if (!Capacitor.isNativePlatform()) {
    return readWebAuthSession()
  }

  const { value } = await Preferences.get({ key: AUTH_SESSION_STORAGE_KEY })

  if (!value) {
    return null
  }

  try {
    const parsedValue: unknown = JSON.parse(value)
    return isAuthSession(parsedValue) ? parsedValue : null
  } catch {
    return null
  }
}

export async function saveAuthSession(session: AuthSession): Promise<void> {
  const value = JSON.stringify(session)

  if (!Capacitor.isNativePlatform()) {
    localStorage.setItem(AUTH_SESSION_STORAGE_KEY, value)
    return
  }

  await Preferences.set({ key: AUTH_SESSION_STORAGE_KEY, value })
}

export async function clearAuthSession(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
    return
  }

  await Preferences.remove({ key: AUTH_SESSION_STORAGE_KEY })
}
