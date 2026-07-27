import type { ChatMessage, ConnectionMatch } from '@prisma/client';

import type { ChatMessagePayload } from '../types/matching.types.js';
import { HttpException } from '../utils/exceptions.util.js';
import prisma from '../utils/prisma.client.js';

function isMatchOwner(match: ConnectionMatch, userId: string): boolean {
  return match.userAId === userId || match.userBId === userId;
}

function mapMessage(message: ChatMessage): Record<string, unknown> {
  return {
    body: message.body,
    createdAt: message.createdAt,
    id: message.id,
    isMine: false,
    readAt: message.readAt,
    senderId: message.senderId,
  };
}

export default class ConversationService {
  public async getConversation(userId: string, matchId: string): Promise<Record<string, unknown>> {
    const match = await prisma.connectionMatch.findUnique({
      where: { id: matchId },
      include: { conversation: { include: { messages: { orderBy: { createdAt: 'asc' } } } } },
    });

    if (!match || !isMatchOwner(match, userId) || match.unmatchedAt) {
      throw new HttpException('Conversation not found.', 404);
    }

    if (!match.conversation) {
      throw new HttpException('Conversation not found.', 404);
    }

    await prisma.chatMessage.updateMany({
      where: {
        conversationId: match.conversation.id,
        readAt: null,
        senderId: { not: userId },
      },
      data: { readAt: new Date() },
    });

    return {
      matchId: match.id,
      messages: match.conversation.messages.map((message) => ({
        ...mapMessage(message),
        isMine: message.senderId === userId,
      })),
    };
  }

  public async sendMessage(userId: string, matchId: string, payload: ChatMessagePayload): Promise<Record<string, unknown>> {
    const match = await prisma.connectionMatch.findUnique({
      where: { id: matchId },
      include: { conversation: true },
    });

    if (!match || !isMatchOwner(match, userId) || match.unmatchedAt || !match.conversation) {
      throw new HttpException('Conversation not found.', 404);
    }

    const message = await prisma.chatMessage.create({
      data: {
        body: payload.body.trim(),
        conversationId: match.conversation.id,
        senderId: userId,
      },
    });

    return {
      ...mapMessage(message),
      isMine: true,
    };
  }

  public async listMatches(userId: string): Promise<Record<string, unknown>[]> {
    const matches = await prisma.connectionMatch.findMany({
      where: {
        unmatchedAt: null,
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      include: {
        session: true,
        userA: { include: { datingProfile: { include: { photos: { orderBy: { position: 'asc' } } } } } },
        userB: { include: { datingProfile: { include: { photos: { orderBy: { position: 'asc' } } } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return matches.flatMap((match) => {
      const otherUser = match.userAId === userId ? match.userB : match.userA;
      const otherProfile = otherUser.datingProfile;

      if (!otherProfile) {
        return [];
      }

      return [{
        createdAt: match.createdAt,
        displayName: otherUser.displayName,
        intent: match.intent,
        matchId: match.id,
        photoUrl: otherProfile.photos[0]?.secureUrl ?? null,
        sessionId: match.sessionId,
      }];
    });
  }

  public async unmatch(userId: string, matchId: string): Promise<void> {
    const match = await prisma.connectionMatch.findUnique({ where: { id: matchId } });

    if (!match || !isMatchOwner(match, userId) || match.unmatchedAt) {
      throw new HttpException('Match not found.', 404);
    }

    await prisma.connectionMatch.update({
      where: { id: match.id },
      data: { unmatchedAt: new Date() },
    });
  }
}
