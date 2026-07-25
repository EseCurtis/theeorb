import { Capacitor } from '@capacitor/core'

function getApiBaseUrl(): string {
  const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  if (configuredApiBaseUrl) {
    return configuredApiBaseUrl
  }

  return 'http://127.0.0.1:4000'
}

const ENV = {
  API_BASE_URL: getApiBaseUrl(),
  ENVIRONMENT: (import.meta.env.VITE_ENVIRONMENT ?? 'development') as
    | 'development'
    | 'production'
    | 'staging',
  PLATFORM: Capacitor.getPlatform() as 'android' | 'ios' | 'web',
  PLATFORMS: {
    ANDROID: 'android',
    IOS: 'ios',
    WEB: 'web',
  } as const,
}

export default ENV
