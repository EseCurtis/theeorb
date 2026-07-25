import { useEffect, useState } from 'react'

import { readCssSafeAreaInsets } from '@/shared/utils/safe-area.util'

type SafeAreaInsets = {
  bottom: string
  left: string
  right: string
  top: string
}

export function useSafeAreaInsets(): SafeAreaInsets {
  const [insets, setInsets] = useState<SafeAreaInsets>({
    bottom: '0px',
    left: '0px',
    right: '0px',
    top: '0px',
  })

  useEffect(() => {
    function syncInsets(): void {
      setInsets(readCssSafeAreaInsets())
    }

    syncInsets()
    window.addEventListener('resize', syncInsets)
    window.addEventListener('safe-area-insets-updated', syncInsets)

    return () => {
      window.removeEventListener('resize', syncInsets)
      window.removeEventListener('safe-area-insets-updated', syncInsets)
    }
  }, [])

  return insets
}
