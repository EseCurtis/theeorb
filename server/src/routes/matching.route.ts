import { Router } from 'express';

import MatchingController from '../controllers/matching.controller.js';
import { CatchErrors } from '../middleware/catchErrors.js';
import passport from '../middleware/jwt.token.js';
import { validate } from '../middleware/validate.js';
import {
  ConnectionMatchParamsSchema,
  MatchDecisionRequestSchema,
  MatchSessionParamsSchema,
} from '../schemas/matching.schema.js';

const router = Router();
const matchingController = new MatchingController();
const authenticate = passport.authenticate('jwt', { session: false });

router.get('/discover/recommendations', authenticate, CatchErrors(matchingController.getRecommendations));
router.post(
  '/discover/recommendations/:sessionId/decision',
  authenticate,
  validate(MatchDecisionRequestSchema),
  CatchErrors(matchingController.decideRecommendation),
);
router.get('/matches', authenticate, CatchErrors(matchingController.listMatches));
router.get(
  '/orb-match-sessions/:sessionId/history',
  authenticate,
  validate(MatchSessionParamsSchema),
  CatchErrors(matchingController.getOrbHistory),
);
router.post(
  '/matches/:matchId/unmatch',
  authenticate,
  validate(ConnectionMatchParamsSchema),
  CatchErrors(matchingController.unmatch),
);

export default router;
