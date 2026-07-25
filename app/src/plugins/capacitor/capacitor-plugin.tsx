import { App } from '@capacitor/app'
import { useEffect } from 'react'

import ConfigCapacitorApp from './config'

export function CapacitorPlugin(): null {
  useEffect(() => {
    const urlListener = App.addListener('appUrlOpen', () => undefined)

    ConfigCapacitorApp()

    return () => {
      void urlListener.then((listener) => listener.remove())
    }
  }, [])

  return null
}
