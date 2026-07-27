import { z } from 'zod';

import { RequestSchema } from './request.schema.js';

const orbTextSchema = z.string().trim().min(2, 'Enter at least 2 characters').max(160);

export const CreateOrbRequestSchema = RequestSchema.extend({
  body: z
    .object({
      interests: orbTextSchema,
      name: z.string().trim().min(2, 'Choose a name with at least 2 characters').max(32),
      objective: orbTextSchema,
      personality: orbTextSchema,
      speakingStyle: orbTextSchema,
      values: orbTextSchema,
      visualForm: z.enum(['ECLIPSE', 'LUMEN', 'NOVA']),
    })
    .strict(),
});
