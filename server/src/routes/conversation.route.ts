import { Router } from 'express';

import ConversationController from '../controllers/conversation.controller.js';
import { CatchErrors } from '../middleware/catchErrors.js';
import passport from '../middleware/jwt.token.js';
import { validate } from '../middleware/validate.js';
import { ConnectionMatchParamsSchema, SendChatMessageRequestSchema } from '../schemas/matching.schema.js';

const router = Router();
const conversationController = new ConversationController();
const authenticate = passport.authenticate('jwt', { session: false });

router.get(
  '/matches/:matchId/conversation',
  authenticate,
  validate(ConnectionMatchParamsSchema),
  CatchErrors(conversationController.getConversation),
);
router.post(
  '/matches/:matchId/conversation/messages',
  authenticate,
  validate(SendChatMessageRequestSchema),
  CatchErrors(conversationController.sendMessage),
);

export default router;
