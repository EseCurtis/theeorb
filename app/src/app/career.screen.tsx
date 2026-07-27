import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'

import { ButtonPrimary } from '@/components/common/button-primary.component'
import { Panel } from '@/components/common/panel.component'
import { ScreenLayout } from '@/components/layout/screen-layout.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { useCareer } from '@/hooks/use-career.hook'
import type { CareerProfileInput } from '@/shared/types/career.types'

const initialProfile: CareerProfileInput = {
  education: [],
  experience: [],
  fullName: '',
  headline: '',
  links: {},
  location: '',
  phone: '',
  skills: [],
  summary: '',
}

function parseSkills(value: string): string[] {
  return value.split(',').map((skill) => skill.trim()).filter(Boolean)
}

export function CareerScreen(): React.JSX.Element {
  const { careerDocuments, careerProfile, documentsError, isLoadingCareer, isSavingProfile, isUploadingDocument, profileError, saveProfile, uploadDocument } = useCareer()
  const [profile, setProfile] = useState<CareerProfileInput>(careerProfile ?? initialProfile)
  const [wasInitialized, setWasInitialized] = useState(Boolean(careerProfile))
  const [message, setMessage] = useState('')

  if (careerProfile && !wasInitialized) {
    setProfile({ ...careerProfile, location: careerProfile.location ?? '', phone: careerProfile.phone ?? '' })
    setWasInitialized(true)
  }

  async function handleSave(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    await saveProfile(profile)
    setMessage('Career profile saved. Your Orb can use these confirmed details.')
  }

  async function handleDocumentChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      setMessage('Choose a PDF or DOCX CV under 10 MB.')
      return
    }
    await uploadDocument(file)
    setMessage('Private CV uploaded. It is used only when you choose an application attachment.')
    event.target.value = ''
  }

  return (
    <ScreenLayout description="Confirm the facts your Career Orb may use. Your CV stays private until you attach it to a reviewed application." title="Career setup">
      {isLoadingCareer ? <Panel label="CAREER // LOADING" tone="cyan"><Text className="text-[0.62rem] text-[var(--muted)]">READING YOUR PRIVATE CAREER RECORD...</Text></Panel> : null}
      {profileError || documentsError ? <Panel label="CAREER // SIGNAL LOST" tone="pink"><Text className="text-sm text-[var(--muted)]">{(profileError ?? documentsError)?.message}</Text></Panel> : null}
      <Panel label="CV // PRIVATE VAULT" tone="cyan">
        <Text className="text-sm leading-6 text-[var(--muted)]">Upload one or more PDF or DOCX versions. The original file is attached only after your explicit review and send.</Text>
        <label className="flex min-h-12 cursor-pointer items-center justify-center rounded-[1.15rem] border border-[#9ceee9]/60 bg-[#0a4147] px-5 py-3 text-[0.62rem] tracking-[0.06em] text-[#d4fffb] shadow-[inset_0_2px_0_rgba(255,255,255,0.25),inset_0_-4px_0_rgba(2,47,53,0.9),0_7px_0_#04363d]">
          {isUploadingDocument ? 'UPLOADING CV...' : 'CHOOSE CV FILE'}
          <input accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="sr-only" disabled={isUploadingDocument} onChange={(event) => void handleDocumentChange(event)} type="file" />
        </label>
        {careerDocuments.map((document) => <Text className="text-[0.58rem] leading-5 text-[#b7fffa]" key={document.id}>FILE // {document.originalFilename.toUpperCase()}</Text>)}
      </Panel>
      <form className="flex flex-col gap-6" noValidate onSubmit={(event) => void handleSave(event)}>
        <Panel label="PROFILE // CONFIRMED FACTS" tone="violet">
          <label className="flex flex-col gap-2"><Text className="text-[0.58rem] text-[#e5b6ff]">FULL NAME</Text><input className="min-h-12 border border-[#765187] bg-[#0b0610] px-3 text-sm text-white outline-none focus:border-[#e5b6ff]" onChange={(event) => setProfile({ ...profile, fullName: event.target.value })} required value={profile.fullName} /></label>
          <label className="flex flex-col gap-2"><Text className="text-[0.58rem] text-[#e5b6ff]">PROFESSIONAL HEADLINE</Text><input className="min-h-12 border border-[#765187] bg-[#0b0610] px-3 text-sm text-white outline-none focus:border-[#e5b6ff]" onChange={(event) => setProfile({ ...profile, headline: event.target.value })} placeholder="Product designer focused on..." required value={profile.headline} /></label>
          <label className="flex flex-col gap-2"><Text className="text-[0.58rem] text-[#e5b6ff]">CAREER SUMMARY</Text><textarea className="min-h-32 border border-[#765187] bg-[#0b0610] px-3 py-2 text-sm leading-6 text-white outline-none focus:border-[#e5b6ff]" onChange={(event) => setProfile({ ...profile, summary: event.target.value })} required value={profile.summary} /></label>
          <label className="flex flex-col gap-2"><Text className="text-[0.58rem] text-[#e5b6ff]">SKILLS (COMMA SEPARATED)</Text><input className="min-h-12 border border-[#765187] bg-[#0b0610] px-3 text-sm text-white outline-none focus:border-[#e5b6ff]" onChange={(event) => setProfile({ ...profile, skills: parseSkills(event.target.value) })} required value={profile.skills.join(', ')} /></label>
          <View className="grid grid-cols-2 gap-3"><label className="flex flex-col gap-2"><Text className="text-[0.58rem] text-[#e5b6ff]">PHONE</Text><input className="min-h-12 border border-[#765187] bg-[#0b0610] px-3 text-sm text-white outline-none focus:border-[#e5b6ff]" onChange={(event) => setProfile({ ...profile, phone: event.target.value })} value={profile.phone ?? ''} /></label><label className="flex flex-col gap-2"><Text className="text-[0.58rem] text-[#e5b6ff]">LOCATION</Text><input className="min-h-12 border border-[#765187] bg-[#0b0610] px-3 text-sm text-white outline-none focus:border-[#e5b6ff]" onChange={(event) => setProfile({ ...profile, location: event.target.value })} value={profile.location ?? ''} /></label></View>
        </Panel>
        {message ? <View className="border border-[#6ce4dc]/50 bg-[#061b20] p-3"><Text className="text-[0.58rem] leading-5 text-[#b7fffa]">{message}</Text></View> : null}
        <ButtonPrimary disabled={isSavingProfile} type="submit">{isSavingProfile ? 'SAVING...' : 'SAVE CAREER PROFILE'}</ButtonPrimary>
      </form>
    </ScreenLayout>
  )
}
