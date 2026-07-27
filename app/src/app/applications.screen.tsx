import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { ButtonPrimary } from '@/components/common/button-primary.component'
import { ButtonSecondary } from '@/components/common/button-secondary.component'
import { Panel } from '@/components/common/panel.component'
import { ScreenLayout } from '@/components/layout/screen-layout.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { useApplications } from '@/hooks/use-applications.hook'
import type { Application } from '@/shared/types/career.types'

export function ApplicationsScreen(): React.JSX.Element {
  const { applications, applicationsError, gmailConnection, isLoadingApplications, isSavingApplication, isSendingApplication, saveApplication, sendApplication } = useApplications()
  const [expandedApplicationId, setExpandedApplicationId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handleSave(application: Application): Promise<void> {
    try {
      await saveApplication(application)
      setError('')
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this application.')
    }
  }

  async function handleSend(application: Application): Promise<void> {
    try {
      await saveApplication(application)
      await sendApplication(application.id)
      setError('')
    } catch (sendError: unknown) {
      setError(sendError instanceof Error ? sendError.message : 'Could not send this application.')
    }
  }

  return <ScreenLayout description="Every draft, delivery, and retry stays in one private tracker." title="Applications">
    {isLoadingApplications ? <Panel label="TRACKER // LOADING" tone="cyan"><Text className="text-[0.62rem] text-[var(--muted)]">READING YOUR APPLICATION HISTORY...</Text></Panel> : null}
    {applicationsError ? <Panel label="TRACKER // SIGNAL LOST" tone="pink"><Text className="text-sm text-[var(--muted)]">{applicationsError.message}</Text></Panel> : null}
    {error ? <Panel label="APPLICATION // CHECK REQUIRED" tone="pink"><Text className="text-sm text-[var(--muted)]">{error}</Text></Panel> : null}
    {!isLoadingApplications && !applications.length ? <Panel label="TRACKER // EMPTY" tone="amber"><Text className="text-sm leading-6 text-[var(--muted)]">No applications yet. Paste a job listing at the Job Desk to create your first reviewed draft.</Text><Link className="text-[0.6rem] tracking-[0.07em] text-[#ffd199]" to="/app/home">OPEN JOB DESK</Link></Panel> : null}
    {applications.map((application) => <ApplicationCard application={application} expanded={expandedApplicationId === application.id} gmailConnected={Boolean(gmailConnection)} isSaving={isSavingApplication} isSending={isSendingApplication} key={application.id} onSave={handleSave} onSend={handleSend} onToggle={() => setExpandedApplicationId(expandedApplicationId === application.id ? null : application.id)} />)}
  </ScreenLayout>
}

type ApplicationCardProps = {
  readonly application: Application
  readonly expanded: boolean
  readonly gmailConnected: boolean
  readonly isSaving: boolean
  readonly isSending: boolean
  readonly onSave: (application: Application) => Promise<void>
  readonly onSend: (application: Application) => Promise<void>
  readonly onToggle: () => void
}

function ApplicationCard({ application, expanded, gmailConnected, isSaving, isSending, onSave, onSend, onToggle }: ApplicationCardProps): React.JSX.Element {
  const [draft, setDraft] = useState(application)
  const canSend = draft.recipientEmail?.trim() && gmailConnected && draft.status !== 'SENT'

  return <Panel label={`APPLICATION // ${application.status}`} tone={application.status === 'SENT' ? 'cyan' : 'violet'}><View className="gap-3"><Text className="text-base text-[var(--foreground)]">{application.jobListing.roleTitle ?? 'UNTITLED ROLE'}</Text><Text className="text-[0.58rem] text-[var(--muted)]">{application.jobListing.companyName ?? 'COMPANY TO CONFIRM'} · {application.recipientEmail ?? 'RECIPIENT REQUIRED'}</Text>{!expanded ? <ButtonSecondary onClick={onToggle}>REVIEW DRAFT</ButtonSecondary> : <><label className="flex flex-col gap-2"><Text className="text-[0.56rem] text-[#e5b6ff]">RECIPIENT</Text><input className="min-h-11 border border-[#765187] bg-[#0b0610] px-3 text-sm text-white outline-none" onChange={(event) => setDraft({ ...draft, recipientEmail: event.target.value })} value={draft.recipientEmail ?? ''} /></label><label className="flex flex-col gap-2"><Text className="text-[0.56rem] text-[#e5b6ff]">SUBJECT</Text><input className="min-h-11 border border-[#765187] bg-[#0b0610] px-3 text-sm text-white outline-none" onChange={(event) => setDraft({ ...draft, subject: event.target.value })} value={draft.subject} /></label><label className="flex flex-col gap-2"><Text className="text-[0.56rem] text-[#e5b6ff]">COVER LETTER</Text><textarea className="min-h-56 border border-[#765187] bg-[#0b0610] px-3 py-2 text-sm leading-6 text-white outline-none" onChange={(event) => setDraft({ ...draft, coverLetter: event.target.value })} value={draft.coverLetter} /></label><Text className="text-[0.54rem] leading-5 text-[#ffd199]">{gmailConnected ? 'The selected private CV will be attached when you send.' : 'Connect Gmail in Settings before sending.'}</Text><ButtonSecondary disabled={isSaving || application.status === 'SENT'} onClick={() => void onSave(draft)}>{isSaving ? 'SAVING...' : 'SAVE REVIEW'}</ButtonSecondary><ButtonPrimary disabled={!canSend || isSending} onClick={() => void onSend(draft)}>{isSending ? 'SENDING...' : 'REVIEW & SEND'}</ButtonPrimary></>}</View></Panel>
}
