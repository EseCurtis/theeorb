import { http } from '@/shared/api/http'
import type { CreateOrbInput, OrbIdentity } from '@/shared/types/orb.types'

type ApiResponse<TData> = {
  data: TData
  message: {
    code: number
    desc: string
  }
  success: boolean
}

export async function createOrb(input: CreateOrbInput): Promise<OrbIdentity> {
  const { data } = await http.post<ApiResponse<{ orb: OrbIdentity }>>('/api/v1/orb', input)
  return data.data.orb
}

export async function fetchOrb(): Promise<OrbIdentity | null> {
  const { data } = await http.get<ApiResponse<{ orb: OrbIdentity | null }>>('/api/v1/orb')
  return data.data.orb
}
