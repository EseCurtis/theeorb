import { http } from '@/shared/api/http'
import type {
  CreateOrbInput,
  NurseryState,
  OrbIdentity,
  OrbLesson,
  TeachOrbInput,
  UpdateOrbRulesInput,
} from '@/shared/types/orb.types'

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

export async function fetchNursery(): Promise<NurseryState> {
  const { data } = await http.get<ApiResponse<NurseryState>>('/api/v1/orb/nursery')
  return data.data
}

export async function teachOrb(input: TeachOrbInput): Promise<OrbLesson> {
  const { data } = await http.post<ApiResponse<{ lesson: OrbLesson }>>('/api/v1/orb/nursery/teach', input)
  return data.data.lesson
}

export async function updateOrbRules(input: UpdateOrbRulesInput): Promise<OrbIdentity> {
  const { data } = await http.put<ApiResponse<{ orb: OrbIdentity }>>('/api/v1/orb/nursery/rules', input)
  return data.data.orb
}
