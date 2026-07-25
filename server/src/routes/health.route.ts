import { Router } from 'express';

import HealthController from '../controllers/health.controller.js';
import { CatchErrors } from '../middleware/catchErrors.js';

const router = Router();
const healthController = new HealthController();

router.get('/', CatchErrors(healthController.getHealth.bind(healthController)));

export default router;
