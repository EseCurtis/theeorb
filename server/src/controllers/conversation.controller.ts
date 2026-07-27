import type { Request, Response } from 'express';

import { getAuthenticatedRequestUser, getPathParam } from '../helpers/auth-request.helpers.js';
import ConversationService from '../services/conversation.service.js';
import type { ChatMessagePayload } from '../types/matching.types.js';
import SendResponse from '../utils/response.util.js';

export default class ConversationController {
  private conversationService: ConversationService;

  public constructor() {
    this.conversationService = new ConversationService();
  }

  public getConversation = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const conversation = await this.conversationService.getConversation(user.id, getPathParam(request, 'matchId'));

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Conversation retrieved successfully')
      .responseData({ conversation })
      .send();
  };

  public sendMessage = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);
    const message = await this.conversationService.sendMessage(
      user.id,
      getPathParam(request, 'matchId'),
      request.body as ChatMessagePayload,
    );

    return respond
      .status(201)
      .success(true)
      .code(201)
      .desc('Message sent successfully')
      .responseData({ message })
      .send();
  };
}
