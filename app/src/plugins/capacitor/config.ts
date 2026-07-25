import { App } from '@capacitor/app'

import ENV from '@/env'
import androidConfig from './configurations/android'
import iosConfig from './configurations/ios'
import webConfig from './configurations/web'

type BackButtonEvent = {
  canGoBack: boolean
}

const ConfigCapacitorApp = (): void => {
  void App.addListener('backButton', ({ canGoBack }: BackButtonEvent) => {
    if (!canGoBack) {
      void App.exitApp()
      return
    }

    window.history.back()
  })

  switch (ENV.PLATFORM) {
    case ENV.PLATFORMS.ANDROID:
      androidConfig()
      break
    case ENV.PLATFORMS.IOS:
      iosConfig()
      break
    case ENV.PLATFORMS.WEB:
      webConfig()
      break
  }
}

export default ConfigCapacitorApp
