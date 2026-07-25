import ENV from '@/env'

export const PLATFORM = ENV.PLATFORM
export const DEVMODE = ENV.ENVIRONMENT === 'development'
export const PLATFORMS = ENV.PLATFORMS

export const IS_IOS = PLATFORM === PLATFORMS.IOS
export const IS_WEB = PLATFORM === PLATFORMS.WEB
export const IS_ANDROID = PLATFORM === PLATFORMS.ANDROID
export const IS_MOBILE = PLATFORM !== PLATFORMS.WEB
