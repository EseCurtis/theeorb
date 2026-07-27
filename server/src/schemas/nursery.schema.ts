import { z } from 'zod';

import { RequestSchema } from './request.schema.js';

export const TeachOrbRequestSchema = RequestSchema.extend({
  body: z
    .object({
      message: z.string().trim().min(1, 'Write a lesson or a test message').max(1000),
    })
    .strict(),
});

export const UpdateOrbRulesRequestSchema = RequestSchema.extend({
  body: z
    .object({
      behaviourRules: z.string().trim().max(600),
    })
    .strict(),
});
