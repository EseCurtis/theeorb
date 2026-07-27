import { createHash } from 'node:crypto';

import Env from '../../config/env.config.js';
import { HttpException } from '../../utils/exceptions.util.js';

export type CloudinaryUploadSignature = {
  apiKey: string;
  cloudName: string;
  folder: string;
  signature: string;
  timestamp: number;
};

export default class CloudinaryService {
  public createProfilePhotoSignature(userId: string): CloudinaryUploadSignature {
    if (!Env.CLOUDINARY_API_KEY || !Env.CLOUDINARY_API_SECRET || !Env.CLOUDINARY_CLOUD_NAME) {
      throw new HttpException('Photo uploads are unavailable. Try again later.', 503);
    }

    const folder = `theeorb/profiles/${userId}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const signatureSource = `folder=${folder}&timestamp=${timestamp}${Env.CLOUDINARY_API_SECRET}`;
    const signature = createHash('sha1').update(signatureSource).digest('hex');

    return {
      apiKey: Env.CLOUDINARY_API_KEY,
      cloudName: Env.CLOUDINARY_CLOUD_NAME,
      folder,
      signature,
      timestamp,
    };
  }

  public isOwnedProfilePhoto(userId: string, cloudinaryId: string, secureUrl: string): boolean {
    const expectedPrefix = `theeorb/profiles/${userId}/`;

    return (
      cloudinaryId.startsWith(expectedPrefix) &&
      secureUrl.startsWith(`https://res.cloudinary.com/${Env.CLOUDINARY_CLOUD_NAME}/image/upload/`)
    );
  }
}
