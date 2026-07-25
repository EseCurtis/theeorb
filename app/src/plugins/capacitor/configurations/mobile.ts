import {
  initializeSafeAreaInsets,
  listenForSafeAreaChanges,
} from '@/shared/utils/safe-area.util'

const mobileConfig = async (): Promise<void> => {
  await initializeSafeAreaInsets()
  await listenForSafeAreaChanges()
}

export default mobileConfig
