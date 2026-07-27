import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'

import { ButtonPrimary } from '@/components/common/button-primary.component'
import { Panel } from '@/components/common/panel.component'
import { ScreenLayout } from '@/components/layout/screen-layout.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { useCareer } from '@/hooks/use-career.hook'
import type { CareerProfileInput } from '@/shared/types/career.types'

const emptyProfile: CareerProfileInput = { education: [], experience: [], fullName: '', headline: '', links: {}, location: '', phone: '', skills: [], summary: '' }

function toSkills(value: string): string[] { return value.split(',').map((skill) => skill.trim()).filter(Boolean) }

export function CareerProfileScreen(): React.JSX.Element {
  const { careerProfile, isSavingProfile, saveProfile } = useCareer()
  const [profile, setProfile] = useState<CareerProfileInput>(emptyProfile)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (careerProfile) setProfile({ ...careerProfile, location: careerProfile.location ?? '', phone: careerProfile.phone ?? '' })
  }, [careerProfile])

  async function handleSave(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    await saveProfile(profile)
    setMessage('Saved. Your Career Orb will use these confirmed facts.')
  }

  return <ScreenLayout backLabel="Career" backTo="/app/career" description="This is the source of truth for every draft." title="Professional profile"><form className="flex flex-col gap-5" onSubmit={(event) => void handleSave(event)}><Panel label="Your details" tone="violet"><Field label="Full name" onChange={(value) => setProfile({ ...profile, fullName: value })} value={profile.fullName} /><Field label="Professional headline" onChange={(value) => setProfile({ ...profile, headline: value })} value={profile.headline} /><label className="flex flex-col gap-2"><Text className="text-sm text-[var(--foreground)]">Career summary</Text><textarea className="min-h-36 rounded-xl border border-white/15 bg-black/20 px-3 py-3 text-sm leading-6 text-white outline-none focus:border-[#d997ff]" onChange={(event) => setProfile({ ...profile, summary: event.target.value })} required value={profile.summary} /></label><Field label="Skills · separated by commas" onChange={(value) => setProfile({ ...profile, skills: toSkills(value) })} value={profile.skills.join(', ')} /><View className="grid grid-cols-2 gap-3"><Field label="Phone" onChange={(value) => setProfile({ ...profile, phone: value })} value={profile.phone ?? ''} /><Field label="Location" onChange={(value) => setProfile({ ...profile, location: value })} value={profile.location ?? ''} /></View></Panel>{message ? <Text className="text-sm text-[#b7fffa]">{message}</Text> : null}<ButtonPrimary disabled={isSavingProfile} type="submit">{isSavingProfile ? 'Saving...' : 'Save profile'}</ButtonPrimary></form></ScreenLayout>
}

type FieldProps = { readonly label: string; readonly onChange: (value: string) => void; readonly value: string }

function Field({ label, onChange, value }: FieldProps): React.JSX.Element { return <label className="flex flex-col gap-2"><Text className="text-sm text-[var(--foreground)]">{label}</Text><input className="min-h-12 rounded-xl border border-white/15 bg-black/20 px-3 text-sm text-white outline-none focus:border-[#d997ff]" onChange={(event) => onChange(event.target.value)} required={label !== 'Phone' && label !== 'Location'} value={value} /></label> }
