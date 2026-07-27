import type { Request, Response } from 'express';

import { getAuthenticatedRequestUser, getPathParam } from '../helpers/auth-request.helpers.js';
import ProfileService from '../services/profile.service.js';
import type {
  DatingProfilePayload,
  ProfilePhotoPayload,
  ReorderPhotosPayload,
} from '../types/matching.types.js';
import SendResponse from '../utils/response.util.js';

export default class ProfileController {
  private profileService: ProfileService;

  public constructor() {
    this.profileService = new ProfileService();
  }

  public getProfile = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const profile = await this.profileService.getProfile(user.id);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Matching profile retrieved successfully')
      .responseData({ profile })
      .send();
  };

  public saveProfile = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const profile = await this.profileService.saveProfile(user.id, request.body as DatingProfilePayload);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Matching profile saved successfully')
      .responseData({ profile })
      .send();
  };

  public createPhotoUploadSignature = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const upload = await this.profileService.createPhotoUploadSignature(user.id);

    return respond
      .status(201)
      .success(true)
      .code(201)
      .desc('Photo upload approved successfully')
      .responseData({ upload })
      .send();
  };

  public addPhoto = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const photo = await this.profileService.addPhoto(user.id, request.body as ProfilePhotoPayload);

    return respond
      .status(201)
      .success(true)
      .code(201)
      .desc('Profile photo saved successfully')
      .responseData({ photo })
      .send();
  };

  public reorderPhotos = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const photos = await this.profileService.reorderPhotos(user.id, request.body as ReorderPhotosPayload);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Profile photo order saved successfully')
      .responseData({ photos })
      .send();
  };

  public removePhoto = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);

    await this.profileService.removePhoto(user.id, getPathParam(request, 'photoId'));

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Profile photo removed successfully')
      .send();
  };
}
