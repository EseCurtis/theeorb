import { Router } from 'express';

import ProfileController from '../controllers/profile.controller.js';
import { CatchErrors } from '../middleware/catchErrors.js';
import passport from '../middleware/jwt.token.js';
import { validate } from '../middleware/validate.js';
import {
  AddProfilePhotoRequestSchema,
  CreatePhotoSignatureRequestSchema,
  ProfilePhotoParamsSchema,
  ReorderProfilePhotosRequestSchema,
  UpsertDatingProfileRequestSchema,
} from '../schemas/matching.schema.js';

const router = Router();
const profileController = new ProfileController();
const authenticate = passport.authenticate('jwt', { session: false });

router.get('/profile/me', authenticate, CatchErrors(profileController.getProfile));
router.put(
  '/profile/me',
  authenticate,
  validate(UpsertDatingProfileRequestSchema),
  CatchErrors(profileController.saveProfile),
);
router.post(
  '/profile/photos/signature',
  authenticate,
  validate(CreatePhotoSignatureRequestSchema),
  CatchErrors(profileController.createPhotoUploadSignature),
);
router.post(
  '/profile/photos',
  authenticate,
  validate(AddProfilePhotoRequestSchema),
  CatchErrors(profileController.addPhoto),
);
router.put(
  '/profile/photos',
  authenticate,
  validate(ReorderProfilePhotosRequestSchema),
  CatchErrors(profileController.reorderPhotos),
);
router.delete(
  '/profile/photos/:photoId',
  authenticate,
  validate(ProfilePhotoParamsSchema),
  CatchErrors(profileController.removePhoto),
);

export default router;
