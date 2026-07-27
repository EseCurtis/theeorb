import { Router } from 'express';

import OrbController from '../controllers/orb.controller.js';
import { CatchErrors } from '../middleware/catchErrors.js';
import passport from '../middleware/jwt.token.js';
import { validate } from '../middleware/validate.js';
import { CreateOrbRequestSchema } from '../schemas/orb.schema.js';

const router = Router();
const orbController = new OrbController();

router.get(
  '/orb',
  passport.authenticate('jwt', { session: false }),
  CatchErrors(orbController.getOrb),
);
router.post(
  '/orb',
  passport.authenticate('jwt', { session: false }),
  validate(CreateOrbRequestSchema),
  CatchErrors(orbController.createOrb),
);

export default router;
