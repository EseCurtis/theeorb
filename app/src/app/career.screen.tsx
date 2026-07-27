import { Link } from '@tanstack/react-router'

import { Panel } from '@/components/common/panel.component'
import { ScreenLayout } from '@/components/layout/screen-layout.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { useCareer } from '@/hooks/use-career.hook'

export function CareerScreen(): React.JSX.Element {
  const { careerDocuments, careerProfile, isLoadingCareer } = useCareer()
  const profileReady = Boolean(careerProfile)
  const cvReady = Boolean(careerDocuments.length)

  return (
    <ScreenLayout description="Keep your professional facts and documents clear, current, and private." title="Career">
      {isLoadingCareer ? <Panel label="Loading" tone="cyan"><Text className="text-sm text-[var(--muted)]">Reading your career workspace...</Text></Panel> : null}
      <Panel label="Your setup" tone="violet">
        <View className="gap-2">
          <Text className="text-lg text-[var(--foreground)]">{profileReady && cvReady ? 'You are ready to draft.' : 'Complete your career essentials.'}</Text>
          <Text className="text-sm leading-6 text-[var(--muted)]">Your Orb uses only the information you confirm here.</Text>
        </View>
      </Panel>
      <Link className="block" to="/app/career/profile"><Panel label={profileReady ? 'Profile complete' : 'Step 1 · Profile'} tone="cyan"><Text className="text-base text-[var(--foreground)]">Professional profile</Text><Text className="text-sm leading-6 text-[var(--muted)]">Headline, summary, skills, location, and contact details.</Text></Panel></Link>
      <Link className="block" to="/app/career/cv"><Panel label={cvReady ? `${careerDocuments.length} CV ${careerDocuments.length === 1 ? 'file' : 'files'}` : 'Step 2 · CV'} tone="amber"><Text className="text-base text-[var(--foreground)]">Private CV vault</Text><Text className="text-sm leading-6 text-[var(--muted)]">Upload PDF or DOCX files. You choose the attachment before sending.</Text></Panel></Link>
    </ScreenLayout>
  )
}
