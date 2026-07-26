import jwt from 'jsonwebtoken';

import Env from '../config/env.config.js';
import type { JwtPayload } from '../types/auth.types.js';

export function createAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, Env.JWT_SECRET, { expiresIn: '7d' });
}
