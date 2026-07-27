import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { ButtonPrimary } from '@/components/common/button-primary.component'
import { ButtonSecondary } from '@/components/common/button-secondary.component'
import { Panel } from '@/components/common/panel.component'
import { ScreenLayout } from '@/components/layout/screen-layout.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { useApplications } from '@/hooks/use-applications.hook'
import { useCareer } from '@/hooks/use-career.hook'

export function HomeScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const { careerDocuments, careerProfile, isLoadingCareer } = useCareer()
  const { createDraft, extractedListing, extractionError, extractListing, isCreatingDraft, isExtracting, isReviewingListing, reviewListing } = useApplications()
  const [listingText, setListingText] = useState('')
  const [draftMessage, setDraftMessage] = useState('')

  async function handleExtract(): Promise<void> {
    setDraftMessage('')
    await extractListing(listingText)
  }

  async function handleCreateDraft(): Promise<void> {
    if (!extractedListing) return
    const reviewedListing = await reviewListing(extractedListing)
    const application = await createDraft(reviewedListing.id)
    setDraftMessage(`Draft saved for ${application.jobListing.roleTitle ?? 'this role'}. Review it in Applications before you send.`)
    await navigate({ to: '/app/applications' })
  }

  const setupComplete = Boolean(careerProfile && careerDocuments.length)

  return <ScreenLayout description="Paste a job listing. Your Career Orb extracts the details, then writes only from facts you have confirmed." title="Job Desk">
    {isLoadingCareer ? <Panel label="JOB DESK // LOADING" tone="cyan"><Text className="text-[0.62rem] text-[var(--muted)]">CHECKING YOUR CAREER SETUP...</Text></Panel> : null}
    {!isLoadingCareer && !setupComplete ? <Panel label="SETUP // REQUIRED" tone="amber"><Text className="text-sm leading-6 text-[var(--muted)]">Before drafting, add your structured career profile and at least one private CV. This keeps every letter grounded in facts you approved.</Text><Link className="text-[0.6rem] tracking-[0.07em] text-[#ffd199]" to="/app/career">COMPLETE CAREER SETUP</Link></Panel> : null}
    <Panel label="JOB DESK // PASTE LISTING" tone="violet">
      <label className="flex flex-col gap-2"><Text className="text-[0.58rem] text-[#e5b6ff]">JOB LISTING</Text><textarea className="min-h-56 border border-[#765187] bg-[#0b0610] px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-[#9c80ab] focus:border-[#e5b6ff]" disabled={!setupComplete || isExtracting} onChange={(event) => setListingText(event.target.value)} placeholder="Paste the full job post here, including the application instructions." value={listingText} /></label>
      <ButtonPrimary disabled={!setupComplete || listingText.trim().length < 40 || isExtracting} onClick={() => void handleExtract()}>{isExtracting ? 'EXTRACTING...' : 'EXTRACT JOB DETAILS'}</ButtonPrimary>
      {!setupComplete ? <Text className="text-[0.54rem] leading-5 text-[#ffd199]">CAREER SETUP IS REQUIRED BEFORE EXTRACTION.</Text> : null}
    </Panel>
    {extractionError ? <Panel label="EXTRACTION // UNAVAILABLE" tone="pink"><Text className="text-sm leading-6 text-[var(--muted)]">{extractionError.message}</Text><Text className="text-[0.56rem] leading-5 text-[#ffd0e4]">Your listing was not turned into a draft. Try again after checking your connection.</Text></Panel> : null}
    {extractedListing ? <Panel label="EXTRACTION // REVIEW" tone="cyan"><View className="gap-3"><Text className="text-base text-[var(--foreground)]">{extractedListing.roleTitle ?? 'ROLE TO CONFIRM'} · {extractedListing.companyName ?? 'COMPANY TO CONFIRM'}</Text><Text className="text-sm text-[var(--muted)]">{extractedListing.location ?? 'Location not stated'} · {extractedListing.workType ?? 'Work type not stated'}</Text><Text className="text-[0.6rem] text-[#b7fffa]">EMAIL // {extractedListing.applicationEmail ?? 'NOT FOUND — CONFIRM BEFORE SENDING'}</Text>{extractedListing.requirements.slice(0, 5).map((requirement) => <Text className="text-sm leading-6 text-[var(--muted)]" key={requirement}>• {requirement}</Text>)}{extractedListing.extractionWarnings.map((warning) => <Text className="text-[0.55rem] leading-5 text-[#ffd199]" key={warning}>CHECK // {warning}</Text>)}</View><ButtonSecondary disabled={isCreatingDraft || isReviewingListing} onClick={() => void handleCreateDraft()}>{isCreatingDraft || isReviewingListing ? 'PREPARING...' : 'CONFIRM DETAILS & DRAFT'}</ButtonSecondary></Panel> : null}
    {draftMessage ? <Panel label="DRAFT // SAVED" tone="cyan"><Text className="text-sm leading-6 text-[var(--muted)]">{draftMessage}</Text></Panel> : null}
  </ScreenLayout>
}
