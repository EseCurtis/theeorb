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
  behaviourRules: string
  id: string
  releaseStatus: 'DRAFT'
}

export type OrbLesson = {
  createdAt: string
  id: string
  orbReply: string
  ownerMessage: string
}

export type NurseryState = {
  lessons: OrbLesson[]
  orb: OrbIdentity
}

export type TeachOrbInput = {
  message: string
}

export type UpdateOrbRulesInput = {
  behaviourRules: string
}
