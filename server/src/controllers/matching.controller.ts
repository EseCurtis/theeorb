import type { Request, Response } from 'express';

import { getAuthenticatedRequestUser, getPathParam } from '../helpers/auth-request.helpers.js';
import ConversationService from '../services/conversation.service.js';
import MatchingService from '../services/matching.service.js';
import type { RecommendationDecisionPayload } from '../types/matching.types.js';
import SendResponse from '../utils/response.util.js';

export default class MatchingController {
  private conversationService: ConversationService;
  private matchingService: MatchingService;

  public constructor() {
    this.conversationService = new ConversationService();
    this.matchingService = new MatchingService();
  }

  public getRecommendations = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const recommendations = await this.matchingService.getRecommendations(user.id);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Daily Orb recommendations retrieved successfully')
      .responseData({ recommendations })
      .send();
  };

  public decideRecommendation = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const decision = await this.matchingService.decideRecommendation(
      user.id,
      getPathParam(request, 'sessionId'),
      request.body as RecommendationDecisionPayload,
    );

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Recommendation decision saved successfully')
      .responseData(decision)
      .send();
  };

  public getOrbHistory = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const history = await this.matchingService.getOrbHistory(user.id, getPathParam(request, 'sessionId'));

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Orb match history retrieved successfully')
      .responseData({ history })
      .send();
  };

  public listMatches = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const matches = await this.conversationService.listMatches(user.id);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Matches retrieved successfully')
      .responseData({ matches })
      .send();
  };

  public unmatch = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);

    await this.conversationService.unmatch(user.id, getPathParam(request, 'matchId'));

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Match closed successfully')
      .send();
  };
}
