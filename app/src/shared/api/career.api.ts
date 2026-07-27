import axios from 'axios'

import { http } from '@/shared/api/http'
import type { Application, CareerDocument, CareerProfile, CareerProfileInput, GmailConnection, JobListing } from '@/shared/types/career.types'

type ApiResponse<TData> = { readonly data: TData }

type UploadSignature = {
  readonly apiKey: string
  readonly cloudName: string
  readonly folder: string
  readonly signature: string
  readonly timestamp: number
  readonly type: 'authenticated'
}

type CloudinaryUploadResponse = { readonly bytes: number; readonly public_id: string }

export async function fetchCareerProfile(): Promise<CareerProfile | null> {
  const response = await http.get<ApiResponse<{ readonly profile: CareerProfile | null }>>('/api/v1/career/profile')
  return response.data.data.profile
}

export async function saveCareerProfile(input: CareerProfileInput): Promise<CareerProfile> {
  const response = await http.put<ApiResponse<{ readonly profile: CareerProfile }>>('/api/v1/career/profile', input)
  return response.data.data.profile
}

export async function fetchCareerDocuments(): Promise<CareerDocument[]> {
  const response = await http.get<ApiResponse<{ readonly documents: CareerDocument[] }>>('/api/v1/career/documents')
  return response.data.data.documents
}

export async function uploadCareerDocument(file: File): Promise<CareerDocument> {
  const signatureResponse = await http.post<ApiResponse<{ readonly upload: UploadSignature }>>('/api/v1/career/documents/signature', {})
  const upload = signatureResponse.data.data.upload
  const formData = new FormData()
  formData.append('api_key', upload.apiKey)
  formData.append('file', file)
  formData.append('folder', upload.folder)
  formData.append('signature', upload.signature)
  formData.append('timestamp', String(upload.timestamp))
  formData.append('type', upload.type)
  const cloudinaryResponse = await axios.post<CloudinaryUploadResponse>(`https://api.cloudinary.com/v1_1/${upload.cloudName}/raw/upload`, formData)
  const response = await http.post<ApiResponse<{ readonly document: CareerDocument }>>('/api/v1/career/documents', {
    byteSize: cloudinaryResponse.data.bytes,
    cloudinaryId: cloudinaryResponse.data.public_id,
    mimeType: file.type,
    originalFilename: file.name,
  })
  return response.data.data.document
}

export async function extractJobListing(rawText: string): Promise<JobListing> {
  const response = await http.post<ApiResponse<{ readonly listing: JobListing }>>('/api/v1/job-listings/extract', { rawText })
  return response.data.data.listing
}

export async function reviewJobListing(listing: JobListing): Promise<JobListing> {
  const response = await http.put<ApiResponse<{ readonly listing: JobListing }>>(`/api/v1/job-listings/${listing.id}`, {
    applicationEmail: listing.applicationEmail ?? undefined,
    companyName: listing.companyName ?? undefined,
    extractionWarnings: listing.extractionWarnings,
    location: listing.location ?? undefined,
    requirements: listing.requirements,
    responsibilities: listing.responsibilities,
    roleTitle: listing.roleTitle ?? undefined,
    salaryCurrency: listing.salaryCurrency ?? undefined,
    salaryMaximum: listing.salaryMaximum ?? undefined,
    salaryMinimum: listing.salaryMinimum ?? undefined,
    salaryPeriod: listing.salaryPeriod ?? undefined,
    skills: listing.skills,
    workType: listing.workType ?? undefined,
  })
  return response.data.data.listing
}

export async function createApplicationDraft(jobListingId: string): Promise<Application> {
  const response = await http.post<ApiResponse<{ readonly application: Application }>>('/api/v1/applications/drafts', { jobListingId })
  return response.data.data.application
}

export async function fetchApplications(): Promise<Application[]> {
  const response = await http.get<ApiResponse<{ readonly applications: Application[] }>>('/api/v1/applications')
  return response.data.data.applications
}

export async function saveApplication(application: Application): Promise<Application> {
  const response = await http.put<ApiResponse<{ readonly application: Application }>>(`/api/v1/applications/${application.id}`, {
    coverLetter: application.coverLetter,
    recipientEmail: application.recipientEmail ?? '',
    subject: application.subject,
  })
  return response.data.data.application
}

export async function sendApplication(applicationId: string): Promise<Application> {
  const response = await http.post<ApiResponse<{ readonly application: Application }>>(`/api/v1/applications/${applicationId}/send`, { confirm: true })
  return response.data.data.application
}

export async function fetchGmailConnection(): Promise<GmailConnection> {
  const response = await http.get<ApiResponse<{ readonly connection: GmailConnection }>>('/api/v1/integrations/gmail')
  return response.data.data.connection
}

export async function createGmailConnectionUrl(): Promise<string> {
  const response = await http.get<ApiResponse<{ readonly authorizationUrl: string }>>('/api/v1/integrations/gmail/connect')
  return response.data.data.authorizationUrl
}
