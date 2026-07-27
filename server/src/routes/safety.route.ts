import { Router } from 'express';

import SafetyController from '../controllers/safety.controller.js';
import { CatchErrors } from '../middleware/catchErrors.js';
import passport from '../middleware/jwt.token.js';
import { validate } from '../middleware/validate.js';
import { BlockUserRequestSchema, ReportUserRequestSchema } from '../schemas/matching.schema.js';

const router = Router();
const safetyController = new SafetyController();
const authenticate = passport.authenticate('jwt', { session: false });

router.post('/safety/blocks', authenticate, validate(BlockUserRequestSchema), CatchErrors(safetyController.blockUser));
router.post('/safety/reports', authenticate, validate(ReportUserRequestSchema), CatchErrors(safetyController.reportUser));

export default router;
