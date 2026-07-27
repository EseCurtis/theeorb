import { useNavigate } from '@tanstack/react-router'

import { OrbSetupForm } from '@/components/orb/orb-setup-form.component'
import { NurseryWorkbench } from '@/components/orb/nursery-workbench.component'
import { ButtonPrimary } from '@/components/common/button-primary.component'
import { ButtonSecondary } from '@/components/common/button-secondary.component'
import { Panel } from '@/components/common/panel.component'
import { ScreenLayout } from '@/components/layout/screen-layout.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { useOrb } from '@/hooks/use-orb.hook'
import { useNursery } from '@/hooks/use-nursery.hook'
import { hapticFeedback } from '@/shared/haptic.util'
import type { CreateOrbInput } from '@/shared/types/orb.types'

export function OrbSetupScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const { createOrb, createOrbError, isCreatingOrb, isLoadingOrb, orb, orbError, refetchOrb } = useOrb()
  const {
    isLoadingNursery,
    isSavingRules,
    isTeachingOrb,
    nursery,
    nurseryError,
    refetchNursery,
    saveRules,
    saveRulesError,
    teachOrb,
    teachOrbError,
  } = useNursery({ enabled: Boolean(orb) })

  async function handleCreateOrb(input: CreateOrbInput): Promise<void> {
    try {
      await createOrb(input)
      await hapticFeedback.light()
    } catch {
      await hapticFeedback.selection()
    }
  }

  async function handleSaveRules(behaviourRules: string): Promise<boolean> {
    try {
      await saveRules({ behaviourRules })
      await hapticFeedback.light()
      return true
    } catch {
      await hapticFeedback.selection()
      return false
    }
  }

  async function handleTeach(message: string): Promise<boolean> {
    try {
      await teachOrb({ message })
      await hapticFeedback.light()
      return true
    } catch {
      await hapticFeedback.selection()
      return false
    }
  }

  if (isLoadingOrb) {
    return (
      <ScreenLayout description="Checking the private space where your Career Orb learns your writing voice." title="Career Orb">
        <Panel label="NURSERY // CONNECTING" tone="violet">
          <Text className="text-[0.66rem] leading-6 tracking-[0.05em] text-[var(--muted)]">READING YOUR ORB SIGNAL...</Text>
        </Panel>
      </ScreenLayout>
    )
  }

  if (orbError) {
    return (
      <ScreenLayout description="Your Career Orb could not be read right now." title="Career Orb">
        <Panel label="NURSERY // SIGNAL LOST" tone="pink">
          <Text className="text-sm leading-6 text-[var(--muted)]">{orbError.message}</Text>
          <ButtonSecondary onClick={() => void refetchOrb()}>TRY AGAIN</ButtonSecondary>
        </Panel>
      </ScreenLayout>
    )
  }

  if (orb) {
    if (isLoadingNursery) {
      return (
        <ScreenLayout description="Opening the private space where you teach your Career Orb." title="Career Orb">
          <Panel label="NURSERY // CONNECTING" tone="violet">
            <Text className="text-[0.66rem] leading-6 tracking-[0.05em] text-[var(--muted)]">RESTORING PRIVATE LESSONS...</Text>
          </Panel>
        </ScreenLayout>
      )
    }

    if (nurseryError) {
      return (
        <ScreenLayout description="Your Career Orb history could not be restored right now." title="Career Orb">
          <Panel label="NURSERY // SIGNAL LOST" tone="pink">
            <Text className="text-sm leading-6 text-[var(--muted)]">{nurseryError.message}</Text>
            <ButtonSecondary onClick={() => void refetchNursery()}>TRY AGAIN</ButtonSecondary>
          </Panel>
        </ScreenLayout>
      )
    }

    if (nursery) {
      return (
        <ScreenLayout description="Teach your writing voice and set strict boundaries for application drafts." title="Career Orb">
          <NurseryWorkbench
            isSavingRules={isSavingRules}
            isTeaching={isTeachingOrb}
            nursery={nursery}
            onSaveRules={handleSaveRules}
            onTeach={handleTeach}
            rulesError={saveRulesError}
            teachError={teachOrbError}
          />
        </ScreenLayout>
      )
    }

    return (
      <ScreenLayout description="Your Career Orb is private and waiting for its first lesson." title="Career Orb">
        <Panel label="ORB // PRIVATE DRAFT" tone="violet">
          <View className="gap-2">
            <Text className="text-lg leading-7 tracking-[0.06em] text-[var(--foreground)]">{orb.name.toUpperCase()}</Text>
            <Text className="text-[0.62rem] leading-6 text-[#e7b2ff]">STATUS // {orb.releaseStatus}</Text>
            <Text className="text-sm leading-6 text-[var(--muted)]">{orb.objective}</Text>
          </View>
          <View className="border-y border-[#d997ff]/25 py-4">
            <Text className="text-[0.56rem] leading-5 tracking-[0.05em] text-[#d9b5e7]">YOUR ORB ONLY HELPS DRAFT. YOU REVIEW EVERY FACT, RECIPIENT, ATTACHMENT, AND SEND ACTION.</Text>
          </View>
          <ButtonPrimary onClick={() => void navigate({ to: '/app/home' })}>RETURN TO JOB DESK</ButtonPrimary>
        </Panel>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout description="Create a private Career Orb that learns your voice, never invents your qualifications, and never sends on its own." title="Awaken a Career Orb">
      <OrbSetupForm error={createOrbError} isSaving={isCreatingOrb} onSubmit={handleCreateOrb} />
    </ScreenLayout>
  )
}
