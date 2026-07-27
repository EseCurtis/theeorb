import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { ButtonPrimary } from '@/components/common/button-primary.component'
import { ButtonSecondary } from '@/components/common/button-secondary.component'
import { Panel } from '@/components/common/panel.component'
import { ScreenLayout } from '@/components/layout/screen-layout.component'
import { Text } from '@/components/layout/text.component'
import { useApplications } from '@/hooks/use-applications.hook'
import type { Application } from '@/shared/types/career.types'

type ApplicationReviewScreenProps = { readonly applicationId: string }

export function ApplicationReviewScreen({ applicationId }: ApplicationReviewScreenProps): React.JSX.Element {
  const { applications, gmailConnection, isLoadingApplications, isSavingApplication, isSendingApplication, saveApplication, sendApplication } = useApplications()
  const application = applications.find((item) => item.id === applicationId)
  const [draft, setDraft] = useState<Application | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { if (application) setDraft(application) }, [application])
  async function handleSave(): Promise<void> { if (!draft) return; try { await saveApplication(draft); setError('') } catch (saveError: unknown) { setError(saveError instanceof Error ? saveError.message : 'Could not save this draft.') } }
  async function handleSend(): Promise<void> { if (!draft) return; try { await saveApplication(draft); await sendApplication(draft.id); setError('') } catch (sendError: unknown) { setError(sendError instanceof Error ? sendError.message : 'Could not send this application.') } }
  if (isLoadingApplications) return <ScreenLayout description="Preparing your draft." title="Review application"><Panel label="Loading" tone="cyan"><Text className="text-sm text-[var(--muted)]">Loading draft...</Text></Panel></ScreenLayout>
  if (!draft) return <ScreenLayout description="This draft is unavailable." title="Review application"><Panel label="Not found" tone="pink"><Link className="text-sm text-[#ffd0e4]" to="/app/applications">Back to applications</Link></Panel></ScreenLayout>
  const canSend = Boolean(draft.recipientEmail?.trim() && gmailConnection && draft.status !== 'SENT')
  return <ScreenLayout description="Make the final changes here. Nothing sends until you tap the button below." title="Review application"><Panel label="Application details" tone="violet"><Text className="text-base text-[var(--foreground)]">{draft.jobListing.roleTitle ?? 'Untitled role'}</Text><Text className="text-sm text-[var(--muted)]">{draft.jobListing.companyName ?? 'Company to confirm'}</Text><label className="flex flex-col gap-2"><Text className="text-sm text-[var(--foreground)]">Recipient</Text><input className="min-h-12 rounded-xl border border-white/15 bg-black/20 px-3 text-sm text-white outline-none focus:border-[#d997ff]" onChange={(event) => setDraft({ ...draft, recipientEmail: event.target.value })} value={draft.recipientEmail ?? ''} /></label><label className="flex flex-col gap-2"><Text className="text-sm text-[var(--foreground)]">Subject</Text><input className="min-h-12 rounded-xl border border-white/15 bg-black/20 px-3 text-sm text-white outline-none focus:border-[#d997ff]" onChange={(event) => setDraft({ ...draft, subject: event.target.value })} value={draft.subject} /></label><label className="flex flex-col gap-2"><Text className="text-sm text-[var(--foreground)]">Cover letter</Text><textarea className="min-h-64 rounded-xl border border-white/15 bg-black/20 px-3 py-3 text-sm leading-6 text-white outline-none focus:border-[#d997ff]" onChange={(event) => setDraft({ ...draft, coverLetter: event.target.value })} value={draft.coverLetter} /></label></Panel><Panel label="Send control" tone="cyan"><Text className="text-sm leading-6 text-[var(--muted)]">{gmailConnection ? `Connected as ${gmailConnection.email}. Your selected CV will be attached.` : 'Connect Gmail in Settings before sending.'}</Text></Panel>{error ? <Text className="text-sm text-[#ffd0e4]">{error}</Text> : null}<ButtonSecondary disabled={isSavingApplication || draft.status === 'SENT'} onClick={() => void handleSave()}>{isSavingApplication ? 'Saving...' : 'Save draft'}</ButtonSecondary><ButtonPrimary disabled={!canSend || isSendingApplication} onClick={() => void handleSend()}>{isSendingApplication ? 'Sending...' : 'Review & send'}</ButtonPrimary></ScreenLayout>
}
