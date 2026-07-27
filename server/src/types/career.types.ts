export type CareerProfilePayload = {
  education: Array<Record<string, string>>;
  experience: Array<Record<string, string>>;
  fullName: string;
  headline: string;
  links: Record<string, string>;
  location?: string;
  phone?: string;
  skills: string[];
  summary: string;
};

export type CareerDocumentPayload = {
  byteSize: number;
  cloudinaryId: string;
  mimeType: string;
  originalFilename: string;
};

export type JobListingPayload = {
  rawText: string;
};

export type ReviewedJobListingPayload = {
  applicationEmail?: string;
  companyName?: string;
  employmentType?: string;
  extractionWarnings: string[];
  location?: string;
  requirements: string[];
  responsibilities: string[];
  roleTitle?: string;
  salaryCurrency?: string;
  salaryMaximum?: number;
  salaryMinimum?: number;
  salaryPeriod?: string;
  skills: string[];
  sourceUrl?: string;
  workType?: string;
};

export type DraftApplicationPayload = {
  documentId?: string;
  jobListingId: string;
};

export type UpdateApplicationPayload = {
  coverLetter: string;
  documentId?: string;
  notes?: string;
  recipientEmail: string;
  subject: string;
};

export type SendApplicationPayload = {
  confirm: true;
};

export type JobListingExtraction = ReviewedJobListingPayload;
