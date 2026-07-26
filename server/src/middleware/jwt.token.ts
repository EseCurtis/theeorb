import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import Env from '../config/env.config.js';
import AuthService from '../services/auth.service.js';
import type { JwtPayload } from '../types/auth.types.js';

const authService = new AuthService();

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Env.JWT_SECRET,
    },
    async (payload: JwtPayload, done) => {
      try {
        const user = await authService.getAuthenticatedUser(payload.id);
        done(null, user ?? false);
      } catch (error: unknown) {
        done(error instanceof Error ? error : new Error('Authentication failed'), false);
      }
    },
  ),
);

export default passport;
