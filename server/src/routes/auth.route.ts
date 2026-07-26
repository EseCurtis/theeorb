import { Router } from 'express';

import AuthController from '../controllers/auth.controller.js';
import { CatchErrors } from '../middleware/catchErrors.js';
import passport from '../middleware/jwt.token.js';
import { validate } from '../middleware/validate.js';
import {
  PasswordRecoveryRequestSchema,
  PasswordResetRequestSchema,
  SignInRequestSchema,
  SignUpRequestSchema,
} from '../schemas/auth.schema.js';

const router = Router();
const authController = new AuthController();

router.post('/auth/sign-up', validate(SignUpRequestSchema), CatchErrors(authController.signUp));
router.post('/auth/sign-in', validate(SignInRequestSchema), CatchErrors(authController.signIn));
router.post(
  '/auth/password-recovery',
  validate(PasswordRecoveryRequestSchema),
  CatchErrors(authController.requestPasswordRecovery),
);
router.post(
  '/auth/password-reset',
  validate(PasswordResetRequestSchema),
  CatchErrors(authController.resetPassword),
);
router.get(
  '/auth/session',
  passport.authenticate('jwt', { session: false }),
  CatchErrors(authController.getSession),
);
router.post(
  '/auth/sign-out',
  passport.authenticate('jwt', { session: false }),
  CatchErrors(authController.signOut),
);

export default router;
