import { useNavigate } from '@tanstack/react-router'

import { ButtonPrimary } from '@/components/common/button-primary.component'
import { Panel } from '@/components/common/panel.component'
import { ScreenLayout } from '@/components/layout/screen-layout.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { useAuth } from '@/hooks/use-auth.hook'
import { useOrb } from '@/hooks/use-orb.hook'

export function HomeScreen(): React.JSX.Element {
  const navigate = useNavigate()
  const { session } = useAuth()
  const { isLoadingOrb, orb, orbError, refetchOrb } = useOrb()

  return (
    <ScreenLayout
      description="Your private nursery is ready when you are."
      title={`Welcome, ${session?.user.displayName ?? 'traveller'}`}
    >
      {isLoadingOrb ? (
        <Panel label="ZONE // NURSERY" tone="violet">
          <Text className="text-[0.66rem] leading-6 tracking-[0.05em] text-[var(--muted)]">CHECKING FOR YOUR ORB...</Text>
        </Panel>
      ) : null}
      {orbError ? (
        <Panel label="NURSERY // SIGNAL LOST" tone="pink">
          <Text className="text-sm leading-6 text-[var(--muted)]">{orbError.message}</Text>
          <ButtonPrimary onClick={() => void refetchOrb()}>TRY AGAIN</ButtonPrimary>
        </Panel>
      ) : null}
      {orb ? (
        <Panel label="ORB // PRIVATE DRAFT" tone="violet">
          <View className="gap-2">
            <Text className="text-base leading-7 tracking-[0.05em] text-[var(--foreground)]">{orb.name.toUpperCase()} IS AWAKE.</Text>
            <Text className="text-[0.62rem] leading-6 text-[#e7b2ff]">STATUS // {orb.releaseStatus}</Text>
            <Text className="text-sm leading-6 text-[var(--muted)]">{orb.personality}</Text>
          </View>
          <ButtonPrimary onClick={() => void navigate({ to: '/app/nursery' })}>ENTER THE NURSERY</ButtonPrimary>
        </Panel>
      ) : null}
      {!isLoadingOrb && !orb && !orbError ? (
        <Panel label="ZONE // NURSERY" tone="violet">
          <View className="gap-2">
            <Text className="font-[family-name:var(--font-pixel)] text-base leading-7 tracking-[0.05em] text-[var(--foreground)]">YOUR ORB HAS NOT AWAKENED YET.</Text>
            <Text className="text-sm leading-6 text-[var(--muted)]">Create an Orb in the Nursery, teach it carefully, then choose when it may enter Thee World.</Text>
          </View>
          <ButtonPrimary onClick={() => void navigate({ to: '/app/nursery' })}>AWAKEN YOUR ORB</ButtonPrimary>
        </Panel>
      ) : null}
      <Panel label="OBSERVATORY // EMPTY" tone="cyan">
        <Text className="text-sm leading-6 text-[var(--muted)]">
          There are no Orb stories to read yet. Once your Orb is released, this is where you’ll find its recap.
        </Text>
      </Panel>
    </ScreenLayout>
  )
}
