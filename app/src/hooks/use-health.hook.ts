import { useQuery } from '@tanstack/react-query'

import { fetchHealthStatus } from '@/shared/api/health.api'
import type { HealthStatus } from '@/shared/api/health.api'

const healthQueryKey = ['health'] as const

export function useHealth() {
  const query = useQuery({
    queryKey: healthQueryKey,
    queryFn: fetchHealthStatus,
  })

  return {
    health: query.data as HealthStatus | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
    refreshHealth: () => query.refetch(),
  }
}
