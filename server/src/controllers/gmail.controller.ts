import type { Request, Response } from 'express';

import { getAuthenticatedRequestUser, getQueryParam } from '../helpers/auth-request.helpers.js';
import GmailConnectionService from '../services/gmail-connection.service.js';
import SendResponse from '../utils/response.util.js';

export default class GmailController {
  private gmailConnectionService: GmailConnectionService;

  public constructor() {
    this.gmailConnectionService = new GmailConnectionService();
  }

  public createConnectionUrl = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const authorizationUrl = await this.gmailConnectionService.createConnectionUrl(user.id);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Gmail connection URL created successfully')
      .responseData({ authorizationUrl })
      .send();
  };

  public completeConnection = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const code = getQueryParam(request, 'code');
    const state = getQueryParam(request, 'state');

    await this.gmailConnectionService.completeConnection(code, state);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Gmail connected successfully')
      .responseData({ connected: true })
      .send();
  };

  public getConnection = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const connection = await this.gmailConnectionService.getConnection(user.id);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Gmail connection retrieved successfully')
      .responseData({ connection })
      .send();
  };

  public disconnect = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);

    await this.gmailConnectionService.disconnect(user.id);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Gmail disconnected successfully')
      .send();
  };
}
