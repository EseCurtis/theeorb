import { z } from 'zod';

export const RequestSchema = z.object({
  body: z.unknown().optional(),
  params: z.unknown().optional(),
  query: z.unknown().optional(),
  user: z.unknown().optional(),
});
