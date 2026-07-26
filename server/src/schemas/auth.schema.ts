import { z } from 'zod';

import { RequestSchema } from './request.schema.js';

const emailSchema = z.string().trim().email('Enter a valid email address').max(254);
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters').max(128);

export const SignUpRequestSchema = RequestSchema.extend({
  body: z
    .object({
      displayName: z.string().trim().min(2, 'Enter a name with at least 2 characters').max(60),
      email: emailSchema,
      password: passwordSchema,
    })
    .strict(),
});

export const SignInRequestSchema = RequestSchema.extend({
  body: z
    .object({
      email: emailSchema,
      password: passwordSchema,
    })
    .strict(),
});

export const PasswordRecoveryRequestSchema = RequestSchema.extend({
  body: z
    .object({
      email: emailSchema,
    })
    .strict(),
});

export const PasswordResetRequestSchema = RequestSchema.extend({
  body: z
    .object({
      password: passwordSchema,
      token: z.string().min(32, 'Recovery link is invalid').max(256),
    })
    .strict(),
});
