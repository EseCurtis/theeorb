export type OrbVisualForm = 'ECLIPSE' | 'LUMEN' | 'NOVA'

export type CreateOrbInput = {
  interests: string
  name: string
  objective: string
  personality: string
  speakingStyle: string
  values: string
  visualForm: OrbVisualForm
}

export type OrbIdentity = CreateOrbInput & {
  id: string
  releaseStatus: 'DRAFT'
}
