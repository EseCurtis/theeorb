export type CareerDocument = {
  readonly byteSize: number
  readonly createdAt: string
  readonly id: string
  readonly mimeType: string
  readonly originalFilename: string
}

export type CareerProfile = {
  readonly education: Record<string, string>[]
  readonly experience: Record<string, string>[]
  readonly fullName: string
  readonly headline: string
  readonly id: string
  readonly links: Record<string, string>
  readonly location: string | null
  readonly phone: string | null
  readonly skills: string[]
  readonly summary: string
}

export type CareerProfileInput = Omit<CareerProfile, 'id'>

export type JobListing = {
  readonly applicationEmail: string | null
  readonly companyName: string | null
  readonly extractionWarnings: string[]
  readonly id: string
  readonly location: string | null
  readonly requirements: string[]
  readonly responsibilities: string[]
  readonly roleTitle: string | null
  readonly salaryCurrency: string | null
  readonly salaryMaximum: number | null
  readonly salaryMinimum: number | null
  readonly salaryPeriod: string | null
  readonly skills: string[]
  readonly workType: string | null
}

export type Application = {
  readonly coverLetter: string
  readonly id: string
  readonly jobListing: JobListing
  readonly recipientEmail: string | null
  readonly sentAt: string | null
  readonly status: 'DRAFT' | 'READY' | 'SENT' | 'SEND_FAILED'
  readonly subject: string
}

export type GmailConnection = {
  readonly connectedAt: string
  readonly email: string
} | null
