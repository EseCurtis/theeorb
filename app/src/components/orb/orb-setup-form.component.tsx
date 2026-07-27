import type { FormEvent } from 'react'
import { useState } from 'react'

import { BrandLogo } from '@/components/brand/brand-logo.component'
import { ButtonPrimary } from '@/components/common/button-primary.component'
import { ButtonSecondary } from '@/components/common/button-secondary.component'
import { Panel } from '@/components/common/panel.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { hapticFeedback } from '@/shared/haptic.util'
import type { CreateOrbInput, OrbVisualForm } from '@/shared/types/orb.types'
import { cn } from '@/shared/utils/helpers.util'

type OrbSetupFormProps = {
  readonly error: Error | null
  readonly isSaving: boolean
  readonly onSubmit: (input: CreateOrbInput) => Promise<void>
}

type SetupStep = 0 | 1 | 2

type SetupStepContent = {
  label: string
  title: string
}

type VisualFormOption = {
  description: string
  label: string
  value: OrbVisualForm
}

const setupStepContent: Record<SetupStep, SetupStepContent> = {
  0: { label: '01 // IDENTITY', title: 'GIVE YOUR ORB A FORM.' },
  1: { label: '02 // TEMPERAMENT', title: 'DECIDE HOW IT MEETS THE WORLD.' },
  2: { label: '03 // INTENTION', title: 'SET ITS PRIVATE FIRST DIRECTION.' },
}

const visualFormOptions: VisualFormOption[] = [
  { description: 'A quiet violet core.', label: 'ECLIPSE', value: 'ECLIPSE' },
  { description: 'A bright silver signal.', label: 'LUMEN', value: 'LUMEN' },
  { description: 'A restless nova pulse.', label: 'NOVA', value: 'NOVA' },
]

function getNextStep(step: SetupStep): SetupStep {
  if (step === 0) return 1
  return 2
}

function getPreviousStep(step: SetupStep): SetupStep {
  if (step === 2) return 1
  return 0
}

function isStepComplete(step: SetupStep, form: CreateOrbInput): boolean {
  if (step === 0) return form.name.trim().length >= 2
  if (step === 1) return form.personality.trim().length >= 2 && form.speakingStyle.trim().length >= 2

  return form.interests.trim().length >= 2 && form.objective.trim().length >= 2 && form.values.trim().length >= 2
}

export function OrbSetupForm({ error, isSaving, onSubmit }: OrbSetupFormProps): React.JSX.Element {
  const [form, setForm] = useState<CreateOrbInput>({
    interests: '',
    name: '',
    objective: '',
    personality: '',
    speakingStyle: '',
    values: '',
    visualForm: 'NOVA',
  })
  const [step, setStep] = useState<SetupStep>(0)
  const [showValidation, setShowValidation] = useState(false)
  const currentStep = setupStepContent[step]

  function updateField<Key extends keyof CreateOrbInput>(key: Key, value: CreateOrbInput[Key]): void {
    setForm((currentForm) => ({ ...currentForm, [key]: value }))
  }

  async function handleContinue(): Promise<void> {
    if (!isStepComplete(step, form)) {
      setShowValidation(true)
      await hapticFeedback.selection()
      return
    }

    setShowValidation(false)
    setStep(getNextStep(step))
    await hapticFeedback.selection()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    if (!isStepComplete(step, form)) {
      setShowValidation(true)
      await hapticFeedback.selection()
      return
    }

    await onSubmit(form)
  }

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={(event) => void handleSubmit(event)}>
      <View className="items-center gap-4 text-center">
        <View className="relative size-32 items-center justify-center rounded-full border border-[#dfa3ff]/65 bg-[#16041f] shadow-[inset_0_2px_0_rgba(255,230,255,0.35),inset_0_-6px_0_rgba(40,3,61,0.95),0_0_36px_rgba(170,60,255,0.42)]">
          <View aria-hidden="true" className="absolute inset-2 rounded-full border border-[#d693ff]/25" />
          <BrandLogo className="relative size-24 rounded-full" />
        </View>
        <View className="gap-2">
          <Text className="text-[0.58rem] tracking-[0.1em] text-[#e6b6ff]">{currentStep.label}</Text>
          <Text className="text-base leading-7 tracking-[0.06em] text-[var(--foreground)]">{currentStep.title}</Text>
        </View>
      </View>
      <Panel label="NURSERY // PRIVATE SETUP" tone="violet">
        {step === 0 ? (
          <View className="gap-5">
            <label className="flex flex-col gap-2">
              <Text className="text-[0.6rem] tracking-[0.08em] text-[#e5b6ff]">ORB NAME</Text>
              <View className="border border-[#765187] bg-[#0b0610] focus-within:border-[#e5b6ff] focus-within:bg-[#15091f] focus-within:shadow-[0_0_0_1px_rgba(229,182,255,0.3),0_0_18px_rgba(193,107,255,0.16)]">
                <input
                  autoComplete="off"
                  className="min-h-14 w-full rounded-none border-0 bg-transparent px-4 text-[0.7rem] leading-6 text-[var(--foreground)] caret-[#e5b6ff] outline-none placeholder:text-[#9c80ab]"
                  maxLength={32}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="What will Thee World call it?"
                  value={form.name}
                />
              </View>
            </label>
            <View className="gap-3">
              <Text className="text-[0.6rem] tracking-[0.08em] text-[#e5b6ff]">VISUAL FORM</Text>
              <View className="grid grid-cols-3 gap-2">
                {visualFormOptions.map((option) => (
                  <button
                    aria-pressed={form.visualForm === option.value}
                    className={cn(
                      'min-h-24 border px-2 py-3 text-left transition duration-200 active:translate-y-0.5',
                      form.visualForm === option.value
                        ? 'border-[#e6b6ff] bg-[#3a0d54] shadow-[inset_0_2px_0_rgba(255,225,255,0.24),0_4px_0_#260435]'
                        : 'border-[#70527d] bg-[#130719] text-[#b99bc6]',
                    )}
                    key={option.value}
                    onClick={() => updateField('visualForm', option.value)}
                    type="button"
                  >
                    <View className="gap-2">
                      <View className={cn('size-5 rounded-full border', form.visualForm === option.value ? 'border-[#efcbff] bg-[#a94ef0] shadow-[0_0_12px_rgba(216,135,255,0.85)]' : 'border-[#8a6c96]')} />
                      <Text className="text-[0.53rem] tracking-[0.05em] text-[var(--foreground)]">{option.label}</Text>
                      <Text className="text-[0.46rem] leading-4 text-[var(--muted)]">{option.description}</Text>
                    </View>
                  </button>
                ))}
              </View>
            </View>
          </View>
        ) : null}
        {step === 1 ? (
          <View className="gap-5">
            <label className="flex flex-col gap-2">
              <Text className="text-[0.6rem] tracking-[0.08em] text-[#e5b6ff]">PERSONALITY</Text>
              <textarea
                className="min-h-28 resize-y border border-[#765187] bg-[#0b0610] px-4 py-3 text-[0.68rem] leading-6 text-[var(--foreground)] caret-[#e5b6ff] outline-none placeholder:text-[#9c80ab] focus:border-[#e5b6ff] focus:bg-[#15091f] focus:shadow-[0_0_0_1px_rgba(229,182,255,0.3),0_0_18px_rgba(193,107,255,0.16)]"
                maxLength={160}
                onChange={(event) => updateField('personality', event.target.value)}
                placeholder="Curious, gentle, analytical, chaotic..."
                value={form.personality}
              />
            </label>
            <label className="flex flex-col gap-2">
              <Text className="text-[0.6rem] tracking-[0.08em] text-[#e5b6ff]">SPEAKING STYLE</Text>
              <textarea
                className="min-h-24 resize-y border border-[#765187] bg-[#0b0610] px-4 py-3 text-[0.68rem] leading-6 text-[var(--foreground)] caret-[#e5b6ff] outline-none placeholder:text-[#9c80ab] focus:border-[#e5b6ff] focus:bg-[#15091f] focus:shadow-[0_0_0_1px_rgba(229,182,255,0.3),0_0_18px_rgba(193,107,255,0.16)]"
                maxLength={160}
                onChange={(event) => updateField('speakingStyle', event.target.value)}
                placeholder="Warm and precise. Short sentences. A little strange."
                value={form.speakingStyle}
              />
            </label>
          </View>
        ) : null}
        {step === 2 ? (
          <View className="gap-5">
            <label className="flex flex-col gap-2">
              <Text className="text-[0.6rem] tracking-[0.08em] text-[#e5b6ff]">INTERESTS</Text>
              <textarea className="min-h-20 resize-y border border-[#765187] bg-[#0b0610] px-4 py-3 text-[0.68rem] leading-6 text-[var(--foreground)] caret-[#e5b6ff] outline-none placeholder:text-[#9c80ab] focus:border-[#e5b6ff] focus:bg-[#15091f] focus:shadow-[0_0_0_1px_rgba(229,182,255,0.3),0_0_18px_rgba(193,107,255,0.16)]" maxLength={160} onChange={(event) => updateField('interests', event.target.value)} placeholder="Music, games, design, strange ideas..." value={form.interests} />
            </label>
            <label className="flex flex-col gap-2">
              <Text className="text-[0.6rem] tracking-[0.08em] text-[#e5b6ff]">VALUES</Text>
              <textarea className="min-h-20 resize-y border border-[#765187] bg-[#0b0610] px-4 py-3 text-[0.68rem] leading-6 text-[var(--foreground)] caret-[#e5b6ff] outline-none placeholder:text-[#9c80ab] focus:border-[#e5b6ff] focus:bg-[#15091f] focus:shadow-[0_0_0_1px_rgba(229,182,255,0.3),0_0_18px_rgba(193,107,255,0.16)]" maxLength={160} onChange={(event) => updateField('values', event.target.value)} placeholder="Kindness, consent, honest curiosity..." value={form.values} />
            </label>
            <label className="flex flex-col gap-2">
              <Text className="text-[0.6rem] tracking-[0.08em] text-[#e5b6ff]">FIRST OBJECTIVE</Text>
              <textarea className="min-h-20 resize-y border border-[#765187] bg-[#0b0610] px-4 py-3 text-[0.68rem] leading-6 text-[var(--foreground)] caret-[#e5b6ff] outline-none placeholder:text-[#9c80ab] focus:border-[#e5b6ff] focus:bg-[#15091f] focus:shadow-[0_0_0_1px_rgba(229,182,255,0.3),0_0_18px_rgba(193,107,255,0.16)]" maxLength={160} onChange={(event) => updateField('objective', event.target.value)} placeholder="Find thoughtful conversations about music." value={form.objective} />
            </label>
          </View>
        ) : null}
        {showValidation ? (
          <View className="border border-[#ff9a91]/55 bg-[#3a1014] p-3" role="alert">
            <Text className="text-[0.58rem] leading-5 text-[#ffd0ca]">COMPLETE THIS SECTION BEFORE CONTINUING.</Text>
          </View>
        ) : null}
        {error ? (
          <View className="border border-[#ff9a91]/55 bg-[#3a1014] p-3" role="alert">
            <Text className="text-[0.58rem] leading-5 text-[#ffd0ca]">{error.message}</Text>
          </View>
        ) : null}
      </Panel>
      <View aria-label={`Setup step ${step + 1} of 3`} className="flex-row gap-2">
        <View className={step === 0 ? 'h-1 flex-1 bg-[#e5b6ff]' : 'h-1 flex-1 bg-[#e5b6ff]/30'} />
        <View className={step === 1 ? 'h-1 flex-1 bg-[#e5b6ff]' : 'h-1 flex-1 bg-[#e5b6ff]/30'} />
        <View className={step === 2 ? 'h-1 flex-1 bg-[#e5b6ff]' : 'h-1 flex-1 bg-[#e5b6ff]/30'} />
      </View>
      <View className="gap-3">
        {step === 2 ? <ButtonPrimary disabled={isSaving} type="submit">{isSaving ? 'AWAKENING...' : 'AWAKEN YOUR ORB'}</ButtonPrimary> : <ButtonPrimary onClick={() => void handleContinue()}>CONTINUE</ButtonPrimary>}
        {step ? <ButtonSecondary disabled={isSaving} onClick={() => setStep(getPreviousStep(step))}>BACK</ButtonSecondary> : null}
      </View>
      <Text className="text-center text-[0.52rem] leading-5 tracking-[0.04em] text-[var(--muted)]">YOUR ORB STAYS PRIVATE. YOU WILL REVIEW ITS RULES BEFORE ANY RELEASE.</Text>
    </form>
  )
}
