import type { Request, Response } from 'express';

import OrbService from '../services/orb.service.js';
import type { AuthenticatedUser } from '../types/auth.types.js';
import type { CreateOrbPayload } from '../types/orb.types.js';
import { HttpException } from '../utils/exceptions.util.js';
import SendResponse from '../utils/response.util.js';

function isAuthenticatedUser(user: unknown): user is AuthenticatedUser {
  if (
    !user ||
    typeof user !== 'object' ||
    !('id' in user) ||
    !('email' in user) ||
    !('displayName' in user) ||
    typeof user.id !== 'string' ||
    typeof user.email !== 'string' ||
    typeof user.displayName !== 'string'
  ) {
    return false;
  }

  return true;
}

function getAuthenticatedRequestUser(request: Request): AuthenticatedUser {
  if (!isAuthenticatedUser(request.user)) {
    throw new HttpException('Authentication required', 401);
  }

  return request.user;
}

export default class OrbController {
  private orbService: OrbService;

  constructor() {
    this.orbService = new OrbService();
  }

  createOrb = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const orb = await this.orbService.createOrb(user.id, request.body as CreateOrbPayload);

    return respond
      .status(201)
      .success(true)
      .code(201)
      .desc('Your Orb has awakened in the Nursery')
      .responseData({ orb })
      .send();
  };

  getOrb = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const orb = await this.orbService.getOrb(user.id);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Orb retrieved successfully')
      .responseData({ orb })
      .send();
  };
}
