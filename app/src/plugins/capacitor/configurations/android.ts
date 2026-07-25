import { StatusBar } from '@capacitor/status-bar'

import mobileConfig from './mobile'

const androidConfig = (): void => {
  void StatusBar.setOverlaysWebView({ overlay: true })
  document.documentElement.style.setProperty('--statusbar-clearfix', '0px')
  void mobileConfig()
}

export default androidConfig
