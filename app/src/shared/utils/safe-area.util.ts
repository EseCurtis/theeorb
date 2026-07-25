import { SafeArea } from 'capacitor-plugin-safe-area'

type SafeAreaInsets = {
  bottom: number
  left: number
  right: number
  top: number
}

type SafeAreaInsetKey = keyof SafeAreaInsets

export function applySafeAreaInsets(insets: SafeAreaInsets): void {
  for (const [key, value] of Object.entries(insets)) {
    document.documentElement.style.setProperty(
      `--safe-area-inset-${key}`,
      `${value}px`,
    )
  }

  window.dispatchEvent(new CustomEvent('safe-area-insets-updated'))
}

export async function initializeSafeAreaInsets(): Promise<void> {
  const { insets } = await SafeArea.getSafeAreaInsets()
  applySafeAreaInsets(insets)
}

export async function listenForSafeAreaChanges(): Promise<void> {
  await SafeArea.addListener('safeAreaChanged', (data) => {
    applySafeAreaInsets(data.insets)
  })
}

export function readCssSafeAreaInsets(): Record<SafeAreaInsetKey, string> {
  const computedStyle = getComputedStyle(document.documentElement)

  return {
    bottom: readCssVariable(computedStyle, '--safe-area-inset-bottom'),
    left: readCssVariable(computedStyle, '--safe-area-inset-left'),
    right: readCssVariable(computedStyle, '--safe-area-inset-right'),
    top: readCssVariable(computedStyle, '--safe-area-inset-top'),
  }
}

function readCssVariable(
  computedStyle: CSSStyleDeclaration,
  variableName: string,
): string {
  return computedStyle.getPropertyValue(variableName).trim() || '0px'
}
