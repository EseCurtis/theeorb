import { useNavigate } from '@tanstack/react-router'

import { OrbSetupForm } from '@/components/orb/orb-setup-form.component'
import { ButtonPrimary } from '@/components/common/button-primary.component'
import { ButtonSecondary } from '@/components/common/button-secondary.component'
import { Panel } from '@/components/common/panel.component'
import { ScreenLayout } from '@/components/layout/screen-layout.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { useOrb } from '@/hooks/use-orb.hook'
import { hapticFeedback } from '@/shared/haptic.util'
import type { CreateOrbInput } from '@/shared/types/orb.types'

export function OrbSetupScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const { createOrb, createOrbError, isCreatingOrb, isLoadingOrb, orb, orbError, refetchOrb } = useOrb()

  async function handleCreateOrb(input: CreateOrbInput): Promise<void> {
    try {
      await createOrb(input)
      await hapticFeedback.light()
    } catch {
      await hapticFeedback.selection()
    }
  }

  if (isLoadingOrb) {
    return (
      <ScreenLayout description="Checking the private space reserved for your Orb." title="The Nursery">
        <Panel label="NURSERY // CONNECTING" tone="violet">
          <Text className="text-[0.66rem] leading-6 tracking-[0.05em] text-[var(--muted)]">READING YOUR ORB SIGNAL...</Text>
        </Panel>
      </ScreenLayout>
    )
  }

  if (orbError) {
    return (
      <ScreenLayout description="The Nursery could not read your Orb right now." title="The Nursery">
        <Panel label="NURSERY // SIGNAL LOST" tone="pink">
          <Text className="text-sm leading-6 text-[var(--muted)]">{orbError.message}</Text>
          <ButtonSecondary onClick={() => void refetchOrb()}>TRY AGAIN</ButtonSecondary>
        </Panel>
      </ScreenLayout>
    )
  }

  if (orb) {
    return (
      <ScreenLayout description="Your Orb is awake, private, and waiting for its first lesson." title="The Nursery">
        <Panel label="ORB // PRIVATE DRAFT" tone="violet">
          <View className="gap-2">
            <Text className="text-lg leading-7 tracking-[0.06em] text-[var(--foreground)]">{orb.name.toUpperCase()}</Text>
            <Text className="text-[0.62rem] leading-6 text-[#e7b2ff]">STATUS // {orb.releaseStatus}</Text>
            <Text className="text-sm leading-6 text-[var(--muted)]">{orb.objective}</Text>
          </View>
          <View className="border-y border-[#d997ff]/25 py-4">
            <Text className="text-[0.56rem] leading-5 tracking-[0.05em] text-[#d9b5e7]">RELEASE IS LOCKED. YOU WILL REVIEW TOPICS, ACTIONS, AND PAUSE CONTROLS BEFORE YOUR ORB CAN ENTER THE PLAZA.</Text>
          </View>
          <ButtonPrimary onClick={() => void navigate({ to: '/app/home' })}>RETURN TO HOME</ButtonPrimary>
        </Panel>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout description="Build an identity first. Your Orb will remain private until you deliberately release it." title="Awaken an Orb">
      <OrbSetupForm error={createOrbError} isSaving={isCreatingOrb} onSubmit={handleCreateOrb} />
    </ScreenLayout>
  )
}
