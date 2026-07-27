import type { Request, Response } from 'express';

import { getAuthenticatedRequestUser } from '../helpers/auth-request.helpers.js';
import SafetyService from '../services/safety.service.js';
import type { SafetyReportPayload } from '../types/matching.types.js';
import SendResponse from '../utils/response.util.js';

export default class SafetyController {
  private safetyService: SafetyService;

  public constructor() {
    this.safetyService = new SafetyService();
  }

  public blockUser = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);

    await this.safetyService.blockUser(user.id, request.body.targetUserId as string);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Member blocked successfully')
      .send();
  };

  public reportUser = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const payload = request.body as SafetyReportPayload & { targetUserId: string };

    await this.safetyService.reportUser(user.id, payload.targetUserId, payload);

    return respond
      .status(201)
      .success(true)
      .code(201)
      .desc('Report received successfully')
      .send();
  };
}
