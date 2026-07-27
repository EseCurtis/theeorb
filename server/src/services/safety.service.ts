import type { SafetyReportPayload } from '../types/matching.types.js';
import { HttpException } from '../utils/exceptions.util.js';
import prisma from '../utils/prisma.client.js';

export default class SafetyService {
  public async blockUser(userId: string, targetUserId: string): Promise<void> {
    if (userId === targetUserId) {
      throw new HttpException('You cannot block yourself.', 400);
    }

    const target = await prisma.user.findUnique({ where: { id: targetUserId }, select: { id: true } });

    if (!target) {
      throw new HttpException('That member is unavailable.', 404);
    }

    await prisma.$transaction([
      prisma.userBlock.upsert({
        where: { creatorId_targetId: { creatorId: userId, targetId: targetUserId } },
        create: { creatorId: userId, targetId: targetUserId },
        update: {},
      }),
      prisma.orbMatchSession.updateMany({
        where: {
          status: { in: ['PENDING', 'MATCHED'] },
          OR: [
            { userAId: userId, userBId: targetUserId },
            { userAId: targetUserId, userBId: userId },
          ],
        },
        data: { status: 'DECLINED' },
      }),
      prisma.connectionMatch.updateMany({
        where: {
          unmatchedAt: null,
          OR: [
            { userAId: userId, userBId: targetUserId },
            { userAId: targetUserId, userBId: userId },
          ],
        },
        data: { unmatchedAt: new Date() },
      }),
    ]);
  }

  public async reportUser(userId: string, targetUserId: string, payload: SafetyReportPayload): Promise<void> {
    if (userId === targetUserId) {
      throw new HttpException('You cannot report yourself.', 400);
    }

    const target = await prisma.user.findUnique({ where: { id: targetUserId }, select: { id: true } });

    if (!target) {
      throw new HttpException('That member is unavailable.', 404);
    }

    await prisma.safetyReport.create({
      data: {
        creatorId: userId,
        details: payload.details?.trim(),
        reason: payload.reason.trim(),
        targetId: targetUserId,
      },
    });
  }
}
