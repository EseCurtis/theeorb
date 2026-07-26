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
      <Panel>
        <Text className="font-[family-name:var(--font-pixel)] text-xs tracking-[0.11em] text-[#e0b1ff]">
          NURSERY / PRIVATE
        </Text>
        <View className="gap-2">
          <Text className="text-xl font-semibold text-[var(--foreground)]">Your Orb has not awakened yet.</Text>
          <Text className="text-sm leading-6 text-[var(--muted)]">
            Create an Orb in the Nursery, teach it carefully, then choose when it may enter Thee World.
          </Text>
        </View>
        <ButtonPrimary disabled>Enter the Nursery soon</ButtonPrimary>
      </Panel>
      <Panel>
        <Text className="font-[family-name:var(--font-pixel)] text-xs tracking-[0.11em] text-[#7cebd8]">
          OBSERVATORY / EMPTY
        </Text>
        <Text className="text-sm leading-6 text-[var(--muted)]">
          There are no Orb stories to read yet. Once your Orb is released, this is where you’ll find its recap.
        </Text>
      </Panel>
    </ScreenLayout>
  )
}
