import type { Request, Response } from 'express';

import NurseryService from '../services/nursery.service.js';
import type { AuthenticatedUser } from '../types/auth.types.js';
import type { TeachOrbPayload, UpdateOrbRulesPayload } from '../types/orb.types.js';
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

export default class NurseryController {
  private nurseryService: NurseryService;

  constructor() {
    this.nurseryService = new NurseryService();
  }

  getNursery = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const nursery = await this.nurseryService.getNursery(user.id);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Nursery retrieved successfully')
      .responseData(nursery)
      .send();
  };

  teachOrb = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const lesson = await this.nurseryService.teachOrb(user.id, request.body as TeachOrbPayload);

    return respond
      .status(201)
      .success(true)
      .code(201)
      .desc('Private lesson recorded successfully')
      .responseData({ lesson })
      .send();
  };

  updateRules = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const orb = await this.nurseryService.updateRules(user.id, request.body as UpdateOrbRulesPayload);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Nursery rules saved successfully')
      .responseData({ orb })
      .send();
  };
}
