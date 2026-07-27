import { Link } from '@tanstack/react-router'

import { Panel } from '@/components/common/panel.component'
import { ScreenLayout } from '@/components/layout/screen-layout.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { useApplications } from '@/hooks/use-applications.hook'

export function ApplicationsScreen(): React.JSX.Element {
  const { applications, applicationsError, isLoadingApplications } = useApplications()
  return <ScreenLayout description="Open an application to review its letter, recipient, and send decision." title="Applications">
    {isLoadingApplications ? <Panel label="Loading" tone="cyan"><Text className="text-sm text-[var(--muted)]">Reading your application history...</Text></Panel> : null}
    {applicationsError ? <Panel label="Could not load applications" tone="pink"><Text className="text-sm text-[var(--muted)]">{applicationsError.message}</Text></Panel> : null}
    {!isLoadingApplications && !applications.length ? <Panel label="No applications yet" tone="amber"><Text className="text-sm leading-6 text-[var(--muted)]">Paste a job listing at the Job Desk to create a first draft.</Text><Link className="text-sm text-[#ffd199]" to="/app/home">Open Job Desk</Link></Panel> : null}
    <View className="gap-3">{applications.map((application) => <Link className="block" key={application.id} params={{ applicationId: application.id }} to="/app/applications/$applicationId"><Panel label={application.status === 'SENT' ? 'Sent' : 'Draft'} tone={application.status === 'SENT' ? 'cyan' : 'violet'}><Text className="text-base text-[var(--foreground)]">{application.jobListing.roleTitle ?? 'Untitled role'}</Text><Text className="text-sm text-[var(--muted)]">{application.jobListing.companyName ?? 'Company to confirm'}</Text><Text className="text-sm text-[var(--muted)]">{application.recipientEmail ?? 'Recipient needs review'}</Text></Panel></Link>)}</View>
  </ScreenLayout>
}
