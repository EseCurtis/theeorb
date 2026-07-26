import { http } from '@/shared/api/http'

export type HealthStatus = {
  database: 'down' | 'up'
  service: 'up'
}

type HealthResponse = {
  data: HealthStatus
  message: {
    code: number
    desc: string
  }
  success: boolean
}

export async function fetchHealthStatus(): Promise<HealthStatus> {
  const { data } = await http.get<HealthResponse>('/api/v1/')
  return data.data
}
