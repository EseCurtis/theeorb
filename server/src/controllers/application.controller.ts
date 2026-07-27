import type { Request, Response } from 'express';

import { getAuthenticatedRequestUser, getPathParam } from '../helpers/auth-request.helpers.js';
import ApplicationService from '../services/application.service.js';
import type { DraftApplicationPayload, UpdateApplicationPayload } from '../types/career.types.js';
import SendResponse from '../utils/response.util.js';

export default class ApplicationController {
  private applicationService: ApplicationService;
  public constructor() { this.applicationService = new ApplicationService(); }
  public createDraft = async (request: Request, response: Response): Promise<Response> => { const respond = new SendResponse(response); const user = getAuthenticatedRequestUser(request); const application = await this.applicationService.createDraft(user.id, request.body as DraftApplicationPayload); return respond.status(201).success(true).code(201).desc('Application draft created successfully').responseData({ application }).send(); };
  public listApplications = async (request: Request, response: Response): Promise<Response> => { const respond = new SendResponse(response); const user = getAuthenticatedRequestUser(request); const applications = await this.applicationService.listApplications(user.id); return respond.status(200).success(true).code(200).desc('Applications retrieved successfully').responseData({ applications }).send(); };
  public updateApplication = async (request: Request, response: Response): Promise<Response> => { const respond = new SendResponse(response); const user = getAuthenticatedRequestUser(request); const application = await this.applicationService.updateApplication(user.id, getPathParam(request, 'applicationId'), request.body as UpdateApplicationPayload); return respond.status(200).success(true).code(200).desc('Application draft saved successfully').responseData({ application }).send(); };
  public sendApplication = async (request: Request, response: Response): Promise<Response> => { const respond = new SendResponse(response); const user = getAuthenticatedRequestUser(request); const application = await this.applicationService.sendApplication(user.id, getPathParam(request, 'applicationId')); return respond.status(200).success(true).code(200).desc('Application sent successfully').responseData({ application }).send(); };
}
