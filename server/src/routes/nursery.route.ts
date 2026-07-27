import { Router } from 'express';

import NurseryController from '../controllers/nursery.controller.js';
import { CatchErrors } from '../middleware/catchErrors.js';
import passport from '../middleware/jwt.token.js';
import { validate } from '../middleware/validate.js';
import { TeachOrbRequestSchema, UpdateOrbRulesRequestSchema } from '../schemas/nursery.schema.js';

const router = Router();
const nurseryController = new NurseryController();

router.get(
  '/orb/nursery',
  passport.authenticate('jwt', { session: false }),
  CatchErrors(nurseryController.getNursery),
);
router.post(
  '/orb/nursery/teach',
  passport.authenticate('jwt', { session: false }),
  validate(TeachOrbRequestSchema),
  CatchErrors(nurseryController.teachOrb),
);
router.put(
  '/orb/nursery/rules',
  passport.authenticate('jwt', { session: false }),
  validate(UpdateOrbRulesRequestSchema),
  CatchErrors(nurseryController.updateRules),
);

export default router;
