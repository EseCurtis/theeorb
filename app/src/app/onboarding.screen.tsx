import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { BrandLogo } from '@/components/brand/brand-logo.component'
import { ButtonPrimary } from '@/components/common/button-primary.component'
import { ButtonSecondary } from '@/components/common/button-secondary.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { hapticFeedback } from '@/shared/haptic.util'

type OnboardingStep = 0 | 1 | 2

type OnboardingContent = {
  action: string
  description: string
  label: string
  title: string
}

const onboardingContent: Record<OnboardingStep, OnboardingContent> = {
  0: {
    action: 'CONTINUE',
    description: 'Shape the personality, goals, and boundaries that guide your Orb.',
    label: '01 // RAISE',
    title: 'AN ORB BEGINS IN THE NURSERY.',
  },
  1: {
    action: 'CONTINUE',
    description: 'Review its rules, then choose when it may interact beyond your private space.',
    label: '02 // RELEASE',
    title: 'YOU DECIDE WHEN IT ENTERS THE WORLD.',
  },
  2: {
    action: 'OPEN YOUR NURSERY',
    description: 'Read meaningful recaps, understand its actions, and keep control close.',
    label: '03 // OBSERVE',
    title: 'THE WORLD REMEMBERS WHAT YOUR ORB DOES.',
  },
}

function getPreviousStep(step: OnboardingStep): OnboardingStep {
  if (step === 2) {
    return 1
  }

  return 0
}

function getNextStep(step: OnboardingStep): OnboardingStep {
  if (step === 0) {
    return 1
  }

  return 2
}

export function OnboardingScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const [step, setStep] = useState<OnboardingStep>(0)
  const currentContent = onboardingContent[step]

  async function handleContinue(): Promise<void> {
    if (step === 2) {
      await navigate({ to: '/auth/sign-up' })
      return
    }

    setStep(getNextStep(step))
    await hapticFeedback.selection()
  }

  async function handleBack(): Promise<void> {
    setStep(getPreviousStep(step))
    await hapticFeedback.selection()
  }

  return (
    <View className="relative min-h-dvh overflow-hidden bg-[var(--background)] px-[calc(1.25rem+var(--safe-area-inset-left))] pb-[calc(2rem+var(--safe-area-inset-bottom))] pr-[calc(1.25rem+var(--safe-area-inset-right))] pt-[calc(1.25rem+var(--safe-area-inset-top))]">
      <View className="pointer-events-none absolute left-1/2 top-[18%] size-72 -translate-x-1/2 rounded-full bg-[#7d22d5]/20 blur-3xl" />
      <View className="relative mx-auto flex min-h-[calc(100dvh-3rem-var(--safe-area-inset-top)-var(--safe-area-inset-bottom))] w-full max-w-md flex-col justify-between gap-9">
        <View className="flex-row items-center justify-between border-b border-[#b66bea]/25 pb-4">
          <Text className="text-sm tracking-[0.1em] text-[var(--foreground)]">THEE ORB</Text>
          <Link className="text-[0.55rem] tracking-[0.08em] text-[#e9bcff]" to="/auth/sign-in">
            SIGN IN
          </Link>
        </View>
        <View className="items-center gap-7 text-center">
          <View className="relative size-44 items-center justify-center rounded-full border border-[#d997ff]/55 bg-[#18052b] shadow-[inset_0_2px_0_rgba(255,225,255,0.28),inset_0_-6px_0_rgba(41,4,62,0.9),0_0_40px_rgba(172,59,255,0.38)]">
            <BrandLogo className="size-36 rounded-full" />
          </View>
          <View className="gap-4">
            <Text className="text-[0.62rem] tracking-[0.1em] text-[#e7b2ff]">{currentContent.label}</Text>
            <Text className="text-[1.42rem] leading-[1.55] tracking-[0.06em] text-[var(--foreground)]">
              {currentContent.title}
            </Text>
            <Text className="mx-auto max-w-[19rem] text-[0.66rem] leading-6 tracking-[0.04em] text-[var(--muted)]">
              {currentContent.description}
            </Text>
          </View>
        </View>
        <View className="gap-5">
          <View aria-label={`Onboarding step ${step + 1} of 3`} className="flex-row gap-2">
            <View className={step === 0 ? 'h-1 flex-1 bg-[#e5b6ff]' : 'h-1 flex-1 bg-[#e5b6ff]/30'} />
            <View className={step === 1 ? 'h-1 flex-1 bg-[#e5b6ff]' : 'h-1 flex-1 bg-[#e5b6ff]/30'} />
            <View className={step === 2 ? 'h-1 flex-1 bg-[#e5b6ff]' : 'h-1 flex-1 bg-[#e5b6ff]/30'} />
          </View>
          <ButtonPrimary onClick={() => void handleContinue()}>{currentContent.action}</ButtonPrimary>
          {step ? (
            <ButtonSecondary onClick={() => void handleBack()}>BACK</ButtonSecondary>
          ) : (
            <Text className="text-center text-[0.55rem] leading-5 tracking-[0.05em] text-[var(--muted)]">
              YOUR ORB ONLY ACTS WITHIN THE BOUNDARIES YOU APPROVE.
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}
