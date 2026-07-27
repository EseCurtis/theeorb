import type { FormEvent } from 'react'
import { useState } from 'react'

import { ButtonPrimary } from '@/components/common/button-primary.component'
import { ButtonSecondary } from '@/components/common/button-secondary.component'
import { Panel } from '@/components/common/panel.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import type { NurseryState } from '@/shared/types/orb.types'

type NurseryWorkbenchProps = {
  readonly isSavingRules: boolean
  readonly isTeaching: boolean
  readonly nursery: NurseryState
  readonly rulesError: Error | null
  readonly teachError: Error | null
  readonly onSaveRules: (behaviourRules: string) => Promise<boolean>
  readonly onTeach: (message: string) => Promise<boolean>
}

type LessonTranscriptProps = {
  readonly lesson: NurseryState['lessons'][number]
}

function LessonTranscript({ lesson }: LessonTranscriptProps): React.JSX.Element {
  return (
    <View className="gap-3 border-b border-[#d997ff]/15 pb-5 last:border-b-0 last:pb-0">
      <View className="gap-1 self-end border border-[#d997ff]/40 bg-[#2a0a3b] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,228,255,0.18)]">
        <Text className="text-[0.48rem] tracking-[0.07em] text-[#edc9ff]">YOU // PRIVATE LESSON</Text>
        <Text className="text-[0.62rem] leading-5 text-[var(--foreground)]">{lesson.ownerMessage}</Text>
      </View>
      <View className="gap-1 self-start border border-[#6ce4dc]/35 bg-[#062b30] px-3 py-2 shadow-[inset_0_1px_0_rgba(216,255,252,0.18)]">
        <Text className="text-[0.48rem] tracking-[0.07em] text-[#b7fffa]">ORB // PRIVATE RESPONSE</Text>
        <Text className="text-[0.62rem] leading-5 text-[var(--foreground)]">{lesson.orbReply}</Text>
      </View>
    </View>
  )
}

export function NurseryWorkbench({
  isSavingRules,
  isTeaching,
  nursery,
  rulesError,
  teachError,
  onSaveRules,
  onTeach,
}: NurseryWorkbenchProps): React.JSX.Element {
  const [behaviourRules, setBehaviourRules] = useState(nursery.orb.behaviourRules)
  const [message, setMessage] = useState('')

  async function handleSaveRules(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    await onSaveRules(behaviourRules)
  }

  async function handleTeach(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    if (!message.trim()) {
      return
    }

    const wasTaught = await onTeach(message)

    if (wasTaught) {
      setMessage('')
    }
  }

  return (
    <View className="gap-7">
      <Panel label="ORB // PRIVATE DRAFT" tone="violet">
        <View className="gap-2">
          <Text className="text-lg leading-7 tracking-[0.06em] text-[var(--foreground)]">{nursery.orb.name.toUpperCase()}</Text>
          <Text className="text-[0.58rem] tracking-[0.07em] text-[#e7b2ff]">STATUS // {nursery.orb.releaseStatus}</Text>
          <Text className="text-sm leading-6 text-[var(--muted)]">{nursery.orb.objective}</Text>
        </View>
        <View className="border-y border-[#d997ff]/25 py-4">
          <Text className="text-[0.55rem] leading-5 tracking-[0.04em] text-[#d9b5e7]">PRIVATE TESTING ONLY. YOUR ORB CANNOT POST, REPLY TO OTHERS, OR LEAVE THE NURSERY.</Text>
        </View>
      </Panel>
      <Panel label="RULES // OWNER CONTROL" tone="violet">
        <form className="flex flex-col gap-4" onSubmit={(event) => void handleSaveRules(event)}>
          <label className="flex flex-col gap-2">
            <Text className="text-[0.6rem] tracking-[0.08em] text-[#e5b6ff]">PRIVATE BEHAVIOUR RULES</Text>
            <textarea
              className="min-h-32 resize-y border border-[#765187] bg-[#0b0610] px-4 py-3 text-[0.66rem] leading-6 text-[var(--foreground)] caret-[#e5b6ff] outline-none placeholder:text-[#9c80ab] focus:border-[#e5b6ff] focus:bg-[#15091f] focus:shadow-[0_0_0_1px_rgba(229,182,255,0.3),0_0_18px_rgba(193,107,255,0.16)]"
              maxLength={600}
              onChange={(event) => setBehaviourRules(event.target.value)}
              placeholder="Ask before switching topics. Keep answers considerate. Do not discuss private details."
              value={behaviourRules}
            />
          </label>
          <Text className="text-[0.53rem] leading-5 text-[var(--muted)]">These rules guide private responses now and remain visible for your later release review.</Text>
          {rulesError ? <Text className="border border-[#ff9a91]/55 bg-[#3a1014] p-3 text-[0.58rem] leading-5 text-[#ffd0ca]" role="alert">{rulesError.message}</Text> : null}
          <ButtonSecondary disabled={isSavingRules} type="submit">{isSavingRules ? 'SAVING RULES...' : 'SAVE PRIVATE RULES'}</ButtonSecondary>
        </form>
      </Panel>
      <Panel label="TEACH // PRIVATE CONVERSATION" tone="cyan">
        <View className="max-h-96 gap-5 overflow-y-auto pr-1">
          {nursery.lessons.length ? nursery.lessons.map((lesson) => <LessonTranscript key={lesson.id} lesson={lesson} />) : <Text className="text-[0.6rem] leading-6 text-[var(--muted)]">START WITH A QUESTION, A MEMORY, OR A BOUNDARY. THIS IS WHERE YOU HEAR HOW YOUR ORB INTERPRETS ITS IDENTITY.</Text>}
        </View>
        <form className="flex flex-col gap-4 border-t border-[#6ce4dc]/25 pt-5" onSubmit={(event) => void handleTeach(event)}>
          <label className="flex flex-col gap-2">
            <Text className="text-[0.6rem] tracking-[0.08em] text-[#b7fffa]">MESSAGE FOR {nursery.orb.name.toUpperCase()}</Text>
            <textarea
              className="min-h-28 resize-y border border-[#3c7779] bg-[#04191d] px-4 py-3 text-[0.66rem] leading-6 text-[var(--foreground)] caret-[#b7fffa] outline-none placeholder:text-[#6d9c9e] focus:border-[#6ce4dc] focus:bg-[#06252a] focus:shadow-[0_0_0_1px_rgba(108,228,220,0.28),0_0_18px_rgba(68,211,205,0.14)]"
              maxLength={1000}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Teach something, then see how your Orb responds."
              value={message}
            />
          </label>
          {teachError ? <Text className="border border-[#ff9a91]/55 bg-[#3a1014] p-3 text-[0.58rem] leading-5 text-[#ffd0ca]" role="alert">{teachError.message}</Text> : null}
          <ButtonPrimary disabled={isTeaching || !message.trim()} type="submit">{isTeaching ? 'FORMING RESPONSE...' : 'TEST PRIVATE RESPONSE'}</ButtonPrimary>
        </form>
      </Panel>
    </View>
  )
}
