import { z } from 'zod';

import { RequestSchema } from './request.schema.js';

const connectionIntentSchema = z.enum(['DATING', 'FRIENDSHIP']);
const profilePromptSchema = z
  .object({
    answer: z.string().trim().min(8, 'Write at least 8 characters').max(240),
    prompt: z.string().trim().min(4, 'Choose a prompt').max(120),
  })
  .strict();

function isAdult(dateOfBirth: Date): boolean {
  const today = new Date();
  const adultDate = new Date(dateOfBirth);

  adultDate.setFullYear(adultDate.getFullYear() + 18);

  return adultDate <= today;
}

export const UpsertDatingProfileRequestSchema = RequestSchema.extend({
  body: z
    .object({
      bio: z.string().trim().min(20, 'Write at least 20 characters').max(500),
      city: z.string().trim().min(2, 'Enter your city').max(80),
      dateOfBirth: z.coerce.date().refine(isAdult, 'TheeOrb is for adults aged 18 or older'),
      genderIdentity: z.string().trim().min(2, 'Tell us how you identify').max(80),
      interestedIn: z.array(z.string().trim().min(1).max(80)).min(1, 'Choose who you want to meet').max(12),
      intents: z.array(connectionIntentSchema).min(1, 'Choose dating, friendship, or both').max(2),
      isDiscoverable: z.boolean(),
      latitude: z.number().min(-90).max(90),
      lifestyle: z.record(z.string().trim().max(80)).optional(),
      longitude: z.number().min(-180).max(180),
      maximumAge: z.number().int().min(18).max(100),
      maximumDistanceKm: z.number().int().min(1).max(500),
      minimumAge: z.number().int().min(18).max(100),
      prompts: z.array(profilePromptSchema).min(3, 'Answer three profile prompts').max(3),
      sexualOrientation: z.string().trim().min(2, 'Tell us your orientation').max(80),
    })
    .strict()
    .refine((profile) => profile.minimumAge <= profile.maximumAge, {
      message: 'Your minimum age must not exceed your maximum age',
      path: ['minimumAge'],
    }),
});

export const CreatePhotoSignatureRequestSchema = RequestSchema.extend({
  body: z.object({}).strict(),
});

export const AddProfilePhotoRequestSchema = RequestSchema.extend({
  body: z
    .object({
      cloudinaryId: z.string().trim().min(1).max(240),
      position: z.number().int().min(0).max(5),
      secureUrl: z.string().url('Enter a valid secure upload URL').max(500),
    })
    .strict(),
});

export const ReorderProfilePhotosRequestSchema = RequestSchema.extend({
  body: z
    .object({
      photoIds: z.array(z.string().cuid()).min(1).max(6),
    })
    .strict(),
});

export const ProfilePhotoParamsSchema = RequestSchema.extend({
  params: z
    .object({
      photoId: z.string().cuid('Invalid photo identifier'),
    })
    .strict(),
});

export const MatchSessionParamsSchema = RequestSchema.extend({
  params: z
    .object({
      sessionId: z.string().cuid('Invalid match identifier'),
    })
    .strict(),
});

export const MatchDecisionRequestSchema = MatchSessionParamsSchema.extend({
  body: z
    .object({
      decision: z.enum(['ACCEPT', 'PASS']),
    })
    .strict(),
});

export const ConnectionMatchParamsSchema = RequestSchema.extend({
  params: z
    .object({
      matchId: z.string().cuid('Invalid match identifier'),
    })
    .strict(),
});

export const SendChatMessageRequestSchema = ConnectionMatchParamsSchema.extend({
  body: z
    .object({
      body: z.string().trim().min(1, 'Write a message').max(2000),
    })
    .strict(),
});

export const BlockUserRequestSchema = RequestSchema.extend({
  body: z
    .object({
      targetUserId: z.string().cuid('Invalid member identifier'),
    })
    .strict(),
});

export const ReportUserRequestSchema = RequestSchema.extend({
  body: z
    .object({
      details: z.string().trim().max(1000).optional(),
      reason: z.string().trim().min(3, 'Choose a report reason').max(160),
      targetUserId: z.string().cuid('Invalid member identifier'),
    })
    .strict(),
});
