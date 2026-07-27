import type { Request } from 'express';

import type { AuthenticatedUser } from '../types/auth.types.js';
import { HttpException } from '../utils/exceptions.util.js';

function isAuthenticatedUser(user: unknown): user is AuthenticatedUser {
  return Boolean(
    user &&
      typeof user === 'object' &&
      'id' in user &&
      'email' in user &&
      'displayName' in user &&
      typeof user.id === 'string' &&
      typeof user.email === 'string' &&
      typeof user.displayName === 'string',
  );
}

export function getAuthenticatedRequestUser(request: Request): AuthenticatedUser {
  if (!isAuthenticatedUser(request.user)) {
    throw new HttpException('Authentication required', 401);
  }

  return request.user;
}

export function getPathParam(request: Request, key: string): string {
  const value = request.params[key];

  if (typeof value !== 'string') {
    throw new HttpException('Invalid request path.', 400);
  }

  return value;
}
