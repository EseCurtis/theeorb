import type { Request, Response } from 'express';

import { getAuthenticatedRequestUser, getPathParam } from '../helpers/auth-request.helpers.js';
import ApplicationService from '../services/application.service.js';
import CareerService from '../services/career.service.js';
import type { CareerDocumentPayload, CareerProfilePayload, JobListingPayload, ReviewedJobListingPayload } from '../types/career.types.js';
import SendResponse from '../utils/response.util.js';

export default class CareerController {
  private applicationService: ApplicationService;
  private careerService: CareerService;

  public constructor() { this.applicationService = new ApplicationService(); this.careerService = new CareerService(); }

  public getProfile = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response); const user = getAuthenticatedRequestUser(request); const profile = await this.careerService.getCareerProfile(user.id);
    return respond.status(200).success(true).code(200).desc('Career profile retrieved successfully').responseData({ profile }).send();
  };
  public saveProfile = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response); const user = getAuthenticatedRequestUser(request); const profile = await this.careerService.saveCareerProfile(user.id, request.body as CareerProfilePayload);
    return respond.status(200).success(true).code(200).desc('Career profile saved successfully').responseData({ profile }).send();
  };
  public createDocumentSignature = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response); const user = getAuthenticatedRequestUser(request); const upload = await this.careerService.createDocumentUploadSignature(user.id);
    return respond.status(201).success(true).code(201).desc('CV upload approved successfully').responseData({ upload }).send();
  };
  public saveDocument = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response); const user = getAuthenticatedRequestUser(request); const document = await this.careerService.saveCareerDocument(user.id, request.body as CareerDocumentPayload);
    return respond.status(201).success(true).code(201).desc('CV saved successfully').responseData({ document }).send();
  };
  public listDocuments = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response); const user = getAuthenticatedRequestUser(request); const documents = await this.careerService.listCareerDocuments(user.id);
    return respond.status(200).success(true).code(200).desc('CV documents retrieved successfully').responseData({ documents }).send();
  };
  public extractListing = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response); const user = getAuthenticatedRequestUser(request); const listing = await this.applicationService.extractListing(user.id, request.body as JobListingPayload);
    return respond.status(201).success(true).code(201).desc('Job listing extracted successfully').responseData({ listing }).send();
  };
  public reviewListing = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response); const user = getAuthenticatedRequestUser(request); const listing = await this.applicationService.reviewListing(user.id, getPathParam(request, 'jobListingId'), request.body as ReviewedJobListingPayload);
    return respond.status(200).success(true).code(200).desc('Job listing reviewed successfully').responseData({ listing }).send();
  };
}
