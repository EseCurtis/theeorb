import { Haptics, ImpactStyle } from '@capacitor/haptics'

import { IS_MOBILE } from '@/shared/constants.shared'

export const hapticFeedback = {
  light: async () => {
    if (!IS_MOBILE) {
      return
    }

    try {
      await Haptics.impact({ style: ImpactStyle.Light })
    } catch {
      // Haptics unavailable in this environment.
    }
  },

  medium: async () => {
    if (!IS_MOBILE) {
      return
    }

    try {
      await Haptics.impact({ style: ImpactStyle.Medium })
    } catch {
      // Haptics unavailable in this environment.
    }
  },

  heavy: async () => {
    if (!IS_MOBILE) {
      return
    }

    try {
      await Haptics.impact({ style: ImpactStyle.Heavy })
    } catch {
      // Haptics unavailable in this environment.
    }
  },

  selection: async () => {
    if (!IS_MOBILE) {
      return
    }

    try {
      await Haptics.selectionStart()
    } catch {
      // Haptics unavailable in this environment.
    }
  },
}
