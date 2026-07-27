import { v2 as cloudinary } from 'cloudinary';

import Env from '../../config/env.config.js';
import { HttpException } from '../../utils/exceptions.util.js';

export type CloudinaryDocumentSignature = {
  apiKey: string;
  cloudName: string;
  folder: string;
  signature: string;
  timestamp: number;
  type: 'authenticated';
};

export default class CloudinaryService {
  public constructor() {
    cloudinary.config({
      api_key: Env.CLOUDINARY_API_KEY,
      api_secret: Env.CLOUDINARY_API_SECRET,
      cloud_name: Env.CLOUDINARY_CLOUD_NAME,
      secure: true,
    });
  }

  public createDocumentUploadSignature(userId: string): CloudinaryDocumentSignature {
    this.requireConfiguration();

    const folder = `theeorb/career-documents/${userId}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request({ folder, timestamp, type: 'authenticated' }, Env.CLOUDINARY_API_SECRET);

    return { apiKey: Env.CLOUDINARY_API_KEY, cloudName: Env.CLOUDINARY_CLOUD_NAME, folder, signature, timestamp, type: 'authenticated' };
  }

  public async downloadDocument(publicId: string, originalFilename: string): Promise<Buffer> {
    this.requireConfiguration();

    const extension = originalFilename.split('.').pop() ?? 'pdf';
    const downloadUrl = cloudinary.utils.private_download_url(publicId, extension, {
      attachment: true,
      resource_type: 'raw',
      type: 'authenticated',
    });
    const response = await fetch(downloadUrl);

    if (!response.ok) {
      throw new HttpException('Your CV attachment is unavailable. Try again later.', 503);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  public isOwnedDocument(userId: string, cloudinaryId: string): boolean {
    return cloudinaryId.startsWith(`theeorb/career-documents/${userId}/`);
  }

  private requireConfiguration(): void {
    if (!Env.CLOUDINARY_API_KEY || !Env.CLOUDINARY_API_SECRET || !Env.CLOUDINARY_CLOUD_NAME) {
      throw new HttpException('CV uploads are unavailable. Try again later.', 503);
    }
  }
}
