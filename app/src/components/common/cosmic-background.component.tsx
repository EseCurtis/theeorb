import { View } from '@/components/layout/view.component'
import { cn } from '@/shared/utils/helpers.util'

type CosmicBackgroundProps = {
  readonly variant?: 'auth' | 'onboarding'
}

type CosmicStarProps = {
  readonly className: string
}

function CosmicStar({ className }: CosmicStarProps): React.JSX.Element {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 100 100"
    >
      <path
        d="M50 0C53 30 70 47 100 50C70 53 53 70 50 100C47 70 30 53 0 50C30 47 47 30 50 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function CosmicBackground({ variant = 'auth' }: CosmicBackgroundProps): React.JSX.Element {
  const isOnboarding = variant === 'onboarding'

  return (
    <View aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <View className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(183,78,255,0.18),transparent_28%),radial-gradient(circle_at_8%_78%,rgba(255,152,54,0.13),transparent_27%),radial-gradient(circle_at_92%_65%,rgba(85,220,220,0.11),transparent_23%)]" />
      <View
        className={cn(
          'absolute -left-[44%] top-[20%] size-[140%] rounded-full border border-[#d893ff]/[0.12] shadow-[0_0_90px_rgba(144,43,236,0.16)]',
          isOnboarding && 'top-[27%] border-[#f1c6ff]/[0.16] shadow-[0_0_100px_rgba(193,86,255,0.24)]',
        )}
      />
      <View
        className={cn(
          'absolute -right-[54%] top-[9%] size-[132%] rounded-full border border-[#6ee6df]/[0.09]',
          isOnboarding && 'top-[4%] border-[#ffc66d]/[0.12]',
        )}
      />
      <View className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(218,157,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(218,157,255,0.055)_1px,transparent_1px)] [background-size:18px_18px]" />
      <View className="absolute inset-x-[-14%] bottom-[8%] h-48 rotate-[-10deg] opacity-55 [background-image:repeating-linear-gradient(90deg,transparent_0,transparent_22px,rgba(192,100,255,0.1)_23px,transparent_24px)]" />
      <svg
        className="absolute left-1/2 top-[34%] h-[26rem] w-[38rem] -translate-x-1/2 text-[#d992ff]/30"
        fill="none"
        focusable="false"
        viewBox="0 0 608 416"
      >
        <path d="M44 244C110 96 435 60 564 175C644 246 475 354 286 333C116 314 24 254 44 244Z" stroke="currentColor" strokeWidth="1" />
        <path d="M64 113C202 9 456 49 535 180C591 272 398 346 222 296C79 255 4 158 64 113Z" stroke="currentColor" strokeWidth="1" />
        <path d="M147 355C72 246 178 72 345 58C462 48 548 218 439 325C351 411 194 431 147 355Z" stroke="currentColor" strokeWidth="1" />
        <circle cx="304" cy="208" r="5" fill="currentColor" />
      </svg>
      <CosmicStar className="absolute left-[9%] top-[17%] size-3 text-[#e7b2ff]/85 drop-shadow-[0_0_8px_rgba(220,137,255,0.8)]" />
      <CosmicStar className="absolute right-[12%] top-[26%] size-2 text-[#78ece0]/90 drop-shadow-[0_0_7px_rgba(111,232,222,0.85)]" />
      <CosmicStar className="absolute bottom-[26%] left-[17%] size-2.5 text-[#ffc675]/90 drop-shadow-[0_0_7px_rgba(255,180,78,0.8)]" />
      <CosmicStar className="absolute bottom-[16%] right-[18%] size-3 text-[#ce8fff]/75 drop-shadow-[0_0_8px_rgba(205,124,255,0.8)]" />
      <View className="absolute left-[31%] top-[12%] size-1 bg-[#f5d8ff]/90 shadow-[0_0_10px_#d887ff]" />
      <View className="absolute right-[29%] top-[48%] size-1.5 bg-[#73e9df]/75 shadow-[0_0_10px_#72e7df]" />
      <View className="absolute bottom-[10%] left-[43%] size-1 bg-[#ffc56c]/85 shadow-[0_0_10px_#ffc56c]" />
    </View>
  )
}
