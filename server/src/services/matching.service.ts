import type { DatingProfile, Orb, ProfilePhoto, User } from '@prisma/client';

import GeminiService from './plugins/gemini.service.js';
import logger from '../helpers/logger.js';
import type {
  ConnectionIntent,
  RecommendationDecisionPayload,
} from '../types/matching.types.js';
import { HttpException } from '../utils/exceptions.util.js';
import prisma from '../utils/prisma.client.js';

const DAILY_RECOMMENDATION_LIMIT = 5;
const MATCH_EXPIRY_DAYS = 7;

type ProfileWithMember = DatingProfile & {
  photos: ProfilePhoto[];
  user: User & {
    orb: Orb | null;
  };
};

function parseStringList(value: string): string[] {
  const parsed: unknown = JSON.parse(value);

  return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string') ? parsed : [];
}

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getUTCFullYear() - dateOfBirth.getUTCFullYear();
  const monthDifference = today.getUTCMonth() - dateOfBirth.getUTCMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getUTCDate() < dateOfBirth.getUTCDate())) {
    age -= 1;
  }

  return age;
}

function calculateDistanceKm(first: DatingProfile, second: DatingProfile): number {
  const earthRadiusKm = 6371;
  const latitudeDelta = ((second.latitude - first.latitude) * Math.PI) / 180;
  const longitudeDelta = ((second.longitude - first.longitude) * Math.PI) / 180;
  const firstLatitudeRadians = (first.latitude * Math.PI) / 180;
  const secondLatitudeRadians = (second.latitude * Math.PI) / 180;
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(firstLatitudeRadians) * Math.cos(secondLatitudeRadians) * Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function getSharedIntent(first: DatingProfile, second: DatingProfile): ConnectionIntent | null {
  const firstIntents = parseStringList(first.intents);
  const secondIntents = parseStringList(second.intents);

  if (firstIntents.includes('DATING') && secondIntents.includes('DATING')) {
    return 'DATING';
  }

  if (firstIntents.includes('FRIENDSHIP') && secondIntents.includes('FRIENDSHIP')) {
    return 'FRIENDSHIP';
  }

  return null;
}

function isWithinPreferences(first: DatingProfile, second: DatingProfile, intent: ConnectionIntent): boolean {
  const secondAge = calculateAge(second.dateOfBirth);

  if (secondAge < first.minimumAge || secondAge > first.maximumAge) {
    return false;
  }

  if (calculateDistanceKm(first, second) > first.maximumDistanceKm) {
    return false;
  }

  if (intent === 'FRIENDSHIP') {
    return true;
  }

  return parseStringList(first.interestedIn).includes(second.genderIdentity);
}

function startOfUtcDay(): Date {
  const today = new Date();

  return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
}

function createEvaluationInput(
  first: ProfileWithMember,
  second: ProfileWithMember,
  intent: ConnectionIntent,
): string {
  return JSON.stringify({
    intent,
    orbA: {
      behaviourRules: first.user.orb?.behaviourRules,
      interests: first.user.orb?.interests,
      objective: first.user.orb?.objective,
      personality: first.user.orb?.personality,
      speakingStyle: first.user.orb?.speakingStyle,
      values: first.user.orb?.values,
    },
    orbB: {
      behaviourRules: second.user.orb?.behaviourRules,
      interests: second.user.orb?.interests,
      objective: second.user.orb?.objective,
      personality: second.user.orb?.personality,
      speakingStyle: second.user.orb?.speakingStyle,
      values: second.user.orb?.values,
    },
    personA: {
      bio: first.bio,
      lifestyle: first.lifestyle,
      prompts: first.prompts,
    },
    personB: {
      bio: second.bio,
      lifestyle: second.lifestyle,
      prompts: second.prompts,
    },
  });
}

function mapPublicProfile(profile: ProfileWithMember, distanceKm: number): Record<string, unknown> {
  return {
    bio: profile.bio,
    city: profile.city,
    displayName: profile.user.displayName,
    genderIdentity: profile.genderIdentity,
    lifestyle: JSON.parse(profile.lifestyle) as Record<string, string>,
    photos: profile.photos.map((photo) => ({ id: photo.id, position: photo.position, secureUrl: photo.secureUrl })),
    prompts: JSON.parse(profile.prompts) as unknown[],
    sexualOrientation: profile.sexualOrientation,
    approximateDistanceKm: Math.round(distanceKm),
  };
}

export default class MatchingService {
  private geminiService: GeminiService;

  public constructor() {
    this.geminiService = new GeminiService();
  }

  public async getRecommendations(userId: string): Promise<Record<string, unknown>[]> {
    await this.generateDailyRecommendations(userId);
    const sessions = await prisma.orbMatchSession.findMany({
      where: {
        expiresAt: { gt: new Date() },
        status: 'PENDING',
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      include: {
        userA: { include: { datingProfile: { include: { photos: { orderBy: { position: 'asc' } } }, user: { include: { orb: true } } } } },
        userB: { include: { datingProfile: { include: { photos: { orderBy: { position: 'asc' } } }, user: { include: { orb: true } } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions.flatMap((session) => {
      const candidateProfile = session.userAId === userId ? session.userB.datingProfile : session.userA.datingProfile;
      const currentProfile = session.userAId === userId ? session.userA.datingProfile : session.userB.datingProfile;

      if (!candidateProfile || !currentProfile) {
        return [];
      }

      return [{
        compatibilityScore: session.compatibilityScore,
        expiresAt: session.expiresAt,
        highlights: JSON.parse(session.highlights) as string[],
        intent: session.intent,
        profile: mapPublicProfile(candidateProfile as ProfileWithMember, calculateDistanceKm(currentProfile, candidateProfile)),
        sessionId: session.id,
        summary: session.summary,
      }];
    });
  }

  public async decideRecommendation(
    userId: string,
    sessionId: string,
    payload: RecommendationDecisionPayload,
  ): Promise<Record<string, unknown>> {
    const session = await prisma.orbMatchSession.findFirst({
      where: {
        id: sessionId,
        OR: [{ userAId: userId }, { userBId: userId }],
      },
    });

    if (!session || session.status !== 'PENDING' || session.expiresAt <= new Date()) {
      throw new HttpException('That recommendation is no longer available.', 404);
    }

    const isUserA = session.userAId === userId;

    if (payload.decision === 'PASS') {
      await prisma.$transaction([
        prisma.orbMatchSession.update({
          where: { id: session.id },
          data: {
            status: 'DECLINED',
            userADecision: isUserA ? 'PASS' : session.userADecision,
            userBDecision: isUserA ? session.userBDecision : 'PASS',
          },
        }),
        prisma.orbMatchActivity.create({
          data: {
            description: 'One owner passed on this introduction. The private session is closed.',
            eventType: 'PASSED',
            sessionId: session.id,
          },
        }),
      ]);

      return { status: 'DECLINED' };
    }

    const nextUserADecision = isUserA ? 'ACCEPT' : session.userADecision;
    const nextUserBDecision = isUserA ? session.userBDecision : 'ACCEPT';

    if (nextUserADecision === 'ACCEPT' && nextUserBDecision === 'ACCEPT') {
      const matchedAt = new Date();
      const connection = await prisma.$transaction(async (transaction) => {
        await transaction.orbMatchSession.update({
          where: { id: session.id },
          data: {
            matchedAt,
            status: 'MATCHED',
            userADecision: nextUserADecision,
            userBDecision: nextUserBDecision,
          },
        });
        const match = await transaction.connectionMatch.create({
          data: {
            intent: session.intent,
            sessionId: session.id,
            userAId: session.userAId,
            userBId: session.userBId,
          },
        });

        await transaction.chatConversation.create({ data: { matchId: match.id } });
        await transaction.orbMatchActivity.create({
          data: {
            description: 'Both owners accepted. A private text conversation is now open.',
            eventType: 'MATCHED',
            sessionId: session.id,
          },
        });

        return match;
      });

      return { matchId: connection.id, status: 'MATCHED' };
    }

    await prisma.$transaction([
      prisma.orbMatchSession.update({
        where: { id: session.id },
        data: {
          userADecision: nextUserADecision,
          userBDecision: nextUserBDecision,
        },
      }),
      prisma.orbMatchActivity.create({
        data: {
          description: 'One owner accepted. The introduction is waiting for the other owner.',
          eventType: 'ACCEPTED',
          sessionId: session.id,
        },
      }),
    ]);

    return { status: 'WAITING_FOR_OTHER_OWNER' };
  }

  public async getOrbHistory(userId: string, sessionId: string): Promise<Record<string, unknown>> {
    const session = await prisma.orbMatchSession.findFirst({
      where: {
        id: sessionId,
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      include: { activities: { orderBy: { createdAt: 'asc' } } },
    });

    if (!session) {
      throw new HttpException('Orb history not found.', 404);
    }

    return {
      activities: session.activities.map((activity) => ({
        createdAt: activity.createdAt,
        description: activity.description,
        eventType: activity.eventType,
      })),
      compatibilityScore: session.compatibilityScore,
      highlights: JSON.parse(session.highlights) as string[],
      intent: session.intent,
      status: session.status,
      summary: session.summary,
      turnCount: session.turnCount,
    };
  }

  private async generateDailyRecommendations(userId: string): Promise<void> {
    const currentProfile = await prisma.datingProfile.findUnique({
      where: { userId },
      include: { photos: true, user: { include: { orb: true } } },
    });

    if (!currentProfile || !currentProfile.completedAt || currentProfile.photos.length < 4 || !currentProfile.user.orb) {
      throw new HttpException('Complete your profile, four photos, and Orb before discovery.', 409);
    }

    const dailyCount = await prisma.orbMatchSession.count({
      where: {
        createdAt: { gte: startOfUtcDay() },
        OR: [{ userAId: userId }, { userBId: userId }],
      },
    });
    const slotsRemaining = DAILY_RECOMMENDATION_LIMIT - dailyCount;

    if (slotsRemaining <= 0) {
      return;
    }

    const candidates = await prisma.datingProfile.findMany({
      where: {
        completedAt: { not: null },
        id: { not: currentProfile.id },
        isDiscoverable: true,
      },
      include: { photos: true, user: { include: { orb: true } } },
      take: 50,
    });
    const blockedRows = await prisma.userBlock.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { targetId: userId },
        ],
      },
    });
    const blockedUserIds = new Set(
      blockedRows.flatMap((block) => [block.creatorId, block.targetId]).filter((blockedUserId) => blockedUserId !== userId),
    );
    let createdCount = 0;

    for (const candidate of candidates) {
      if (createdCount >= slotsRemaining || candidate.photos.length < 4 || !candidate.user.orb || blockedUserIds.has(candidate.userId)) {
        continue;
      }

      const intent = getSharedIntent(currentProfile, candidate);

      if (!intent || !isWithinPreferences(currentProfile, candidate, intent) || !isWithinPreferences(candidate, currentProfile, intent)) {
        continue;
      }

      const existingSession = await prisma.orbMatchSession.findFirst({
        where: {
          status: { in: ['PENDING', 'MATCHED'] },
          OR: [
            { userAId: userId, userBId: candidate.userId },
            { userAId: candidate.userId, userBId: userId },
          ],
        },
      });

      if (existingSession) {
        continue;
      }

      try {
        const evaluation = await this.geminiService.evaluateOrbCompatibility(
          createEvaluationInput(currentProfile, candidate, intent),
        );

        if (!evaluation.shouldRecommend) {
          continue;
        }

        const evaluatedAt = new Date();
        const expiresAt = new Date(evaluatedAt.getTime() + MATCH_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

        await prisma.orbMatchSession.create({
          data: {
            activities: {
              create: {
                description: 'Both private Orbs completed a bounded compatibility review. Review their owner-safe explanation.',
                eventType: 'EVALUATED',
              },
            },
            compatibilityScore: evaluation.compatibilityScore,
            evaluatedAt,
            expiresAt,
            highlights: JSON.stringify(evaluation.highlights),
            intent,
            orbAId: currentProfile.user.orb.id,
            orbBId: candidate.user.orb.id,
            summary: evaluation.summary,
            turnCount: evaluation.turnCount,
            userAId: userId,
            userBId: candidate.userId,
          },
        });
        createdCount += 1;
      } catch (error: unknown) {
        logger.warn(error instanceof Error ? { message: error.message, provider: 'gemini' } : 'Compatibility evaluation failed');
      }
    }
  }
}
