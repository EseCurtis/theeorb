import { compare, hash } from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';

import Env from '../config/env.config.js';
import logger from '../helpers/logger.js';
import type {
  AuthenticatedUser,
  AuthSession,
  PasswordRecoveryPayload,
  PasswordResetPayload,
  SignInPayload,
  SignUpPayload,
} from '../types/auth.types.js';
import { HttpException } from '../utils/exceptions.util.js';
import { createAccessToken } from '../utils/jwt.util.js';
import prisma from '../utils/prisma.client.js';

const DUMMY_PASSWORD_HASH = '$2b$12$thdTPKsfXhW1aBUH8pHnvuB6PIeX1FqDUmQCR9Q4MDl2OJIiMghru';

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashResetToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function mapUser(user: { id: string; email: string; displayName: string }): AuthenticatedUser {
  return {
    displayName: user.displayName,
    email: user.email,
    id: user.id,
  };
}

export default class AuthService {
  async signUp(payload: SignUpPayload): Promise<void> {
    const email = normaliseEmail(payload.email);
    const passwordHash = await hash(payload.password, 12);

    try {
      await prisma.user.create({
        data: {
          displayName: payload.displayName.trim(),
          email,
          passwordHash,
        },
      });
    } catch (error: unknown) {
      if (isDuplicateEmailError(error)) {
        logger.warn('Sign-up request received for an existing account');
        return;
      }

      throw error;
    }
  }

  async signIn(payload: SignInPayload): Promise<AuthSession> {
    const user = await prisma.user.findUnique({
      where: { email: normaliseEmail(payload.email) },
    });
    const passwordMatches = await compare(payload.password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);

    if (!user || !passwordMatches) {
      logger.warn('Sign-in rejected due to invalid credentials');
      throw new HttpException('Invalid email or password', 401);
    }

    const authenticatedUser = mapUser(user);

    return {
      token: createAccessToken({ email: authenticatedUser.email, id: authenticatedUser.id }),
      user: authenticatedUser,
    };
  }

  async requestPasswordRecovery(payload: PasswordRecoveryPayload): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email: normaliseEmail(payload.email) },
      select: { id: true },
    });

    await compare('recovery-timing-work', DUMMY_PASSWORD_HASH);

    if (!user) {
      logger.warn('Password recovery requested for an unknown account');
      return;
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + Env.PASSWORD_RESET_TTL_MINUTES * 60_000);

    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
      }),
      prisma.passwordResetToken.create({
        data: {
          expiresAt,
          tokenHash: hashResetToken(token),
          userId: user.id,
        },
      }),
    ]);

    logger.info('Password recovery link generated for delivery');
  }

  async resetPassword(payload: PasswordResetPayload): Promise<void> {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashResetToken(payload.token) },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) {
      logger.warn('Password reset rejected due to an invalid or expired token');
      throw new HttpException('Unable to reset password. Request another recovery link.', 400);
    }

    const passwordHash = await hash(payload.password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);
  }

  async getAuthenticatedUser(id: string): Promise<AuthenticatedUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        displayName: true,
        email: true,
        id: true,
      },
    });

    return user ? mapUser(user) : null;
  }
}

function isDuplicateEmailError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}
