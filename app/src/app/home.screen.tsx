import { ButtonPrimary } from '@/components/common/button-primary.component'
import { Panel } from '@/components/common/panel.component'
import { ScreenLayout } from '@/components/layout/screen-layout.component'
import { Text } from '@/components/layout/text.component'
import { View } from '@/components/layout/view.component'
import { useAuth } from '@/hooks/use-auth.hook'

export function HomeScreen(): React.JSX.Element {
  const { session } = useAuth()

  return (
    <ScreenLayout
      description="Your private nursery is ready when you are."
      title={`Welcome, ${session?.user.displayName ?? 'traveller'}`}
    >
      <Panel label="ZONE // NURSERY" tone="violet">
        <View className="gap-2">
          <Text className="font-[family-name:var(--font-pixel)] text-base leading-7 tracking-[0.05em] text-[var(--foreground)]">
            YOUR ORB HAS NOT AWAKENED YET.
          </Text>
          <Text className="text-sm leading-6 text-[var(--muted)]">
            Create an Orb in the Nursery, teach it carefully, then choose when it may enter Thee World.
          </Text>
        </View>
        <ButtonPrimary disabled>Enter the Nursery soon</ButtonPrimary>
      </Panel>
      <Panel label="OBSERVATORY // EMPTY" tone="cyan">
        <Text className="text-sm leading-6 text-[var(--muted)]">
          There are no Orb stories to read yet. Once your Orb is released, this is where you’ll find its recap.
        </Text>
      </Panel>
    </ScreenLayout>
  )
}
