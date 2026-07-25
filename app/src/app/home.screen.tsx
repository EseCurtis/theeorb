import { ButtonSecondary } from '@/components/common/button-secondary.component'
import { Panel } from '@/components/common/panel.component'
import { ScreenLayout } from '@/components/layout/screen-layout.component'
import { Text } from '@/components/layout/text.component'
import { useHealth } from '@/hooks/use-health.hook'

export function HomeScreen(): React.JSX.Element {
  const { health, isError, isLoading, refreshHealth } = useHealth()

  return (
    <ScreenLayout
      description="Capacitor + Vite + TanStack Router bootstrap"
      title="Home"
    >
      <Panel>
        <Text className="leading-relaxed text-[var(--muted)]">API status</Text>
        {isLoading ? <Text>Checking backend…</Text> : null}
        {isError ? <Text>Backend unreachable</Text> : null}
        {health ? (
          <Text>
            Service {health.service}, database {health.database}
          </Text>
        ) : null}
        <ButtonSecondary
          onClick={() => {
            void refreshHealth()
          }}
        >
          Refresh status
        </ButtonSecondary>
      </Panel>
    </ScreenLayout>
  )
}
