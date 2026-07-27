import { z } from 'zod';

import { RequestSchema } from './request.schema.js';

const stringRecordSchema = z.record(z.string().trim().max(300));
const experienceSchema = z.array(stringRecordSchema).max(30);
const listSchema = z.array(z.string().trim().min(1).max(300)).max(40);

export const UpsertCareerProfileRequestSchema = RequestSchema.extend({
  body: z.object({
    education: experienceSchema,
    experience: experienceSchema,
    fullName: z.string().trim().min(2).max(120),
    headline: z.string().trim().min(4).max(160),
    links: stringRecordSchema,
    location: z.string().trim().max(120).optional(),
    phone: z.string().trim().max(40).optional(),
    skills: listSchema.min(1, 'Add at least one skill'),
    summary: z.string().trim().min(20).max(1200),
  }).strict(),
});

export const CreateDocumentSignatureRequestSchema = RequestSchema.extend({ body: z.object({}).strict() });

export const CreateCareerDocumentRequestSchema = RequestSchema.extend({
  body: z.object({
    byteSize: z.number().int().positive().max(10 * 1024 * 1024),
    cloudinaryId: z.string().trim().min(1).max(240),
    mimeType: z.enum(['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
    originalFilename: z.string().trim().min(1).max(180),
  }).strict(),
});

export const CreateJobListingRequestSchema = RequestSchema.extend({
  body: z.object({ rawText: z.string().trim().min(40, 'Paste the complete job listing').max(20_000) }).strict(),
});

export const JobListingParamsSchema = RequestSchema.extend({
  params: z.object({ jobListingId: z.string().cuid('Invalid job listing identifier') }).strict(),
});

export const ReviewJobListingRequestSchema = JobListingParamsSchema.extend({
  body: z.object({
    applicationEmail: z.string().trim().email().optional(),
    companyName: z.string().trim().max(160).optional(),
    employmentType: z.string().trim().max(80).optional(),
    extractionWarnings: listSchema,
    location: z.string().trim().max(160).optional(),
    requirements: listSchema,
    responsibilities: listSchema,
    roleTitle: z.string().trim().max(160).optional(),
    salaryCurrency: z.string().trim().max(12).optional(),
    salaryMaximum: z.number().nonnegative().optional(),
    salaryMinimum: z.number().nonnegative().optional(),
    salaryPeriod: z.string().trim().max(40).optional(),
    skills: listSchema,
    sourceUrl: z.string().trim().url().optional(),
    workType: z.string().trim().max(80).optional(),
  }).strict(),
});

export const CreateDraftApplicationRequestSchema = RequestSchema.extend({
  body: z.object({
    documentId: z.string().cuid().optional(),
    jobListingId: z.string().cuid(),
  }).strict(),
});

export const ApplicationParamsSchema = RequestSchema.extend({
  params: z.object({ applicationId: z.string().cuid('Invalid application identifier') }).strict(),
});

export const UpdateApplicationRequestSchema = ApplicationParamsSchema.extend({
  body: z.object({
    coverLetter: z.string().trim().min(120).max(1800),
    documentId: z.string().cuid().nullable().optional(),
    notes: z.string().trim().max(3000).optional(),
    recipientEmail: z.string().trim().email(),
    subject: z.string().trim().min(4).max(200),
  }).strict(),
});

export const SendApplicationRequestSchema = ApplicationParamsSchema.extend({
  body: z.object({ confirm: z.literal(true) }).strict(),
});

export const GmailCallbackRequestSchema = RequestSchema.extend({
  query: z.object({ code: z.string().min(1), state: z.string().min(1) }).strict(),
});
