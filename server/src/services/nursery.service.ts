import type { Orb, OrbLesson as PrismaOrbLesson } from '@prisma/client';

import GeminiService from './plugins/gemini.service.js';
import { mapOrb } from './orb.service.js';
import type {
  NurseryState,
  OrbLesson,
  TeachOrbPayload,
  UpdateOrbRulesPayload,
} from '../types/orb.types.js';
import { HttpException } from '../utils/exceptions.util.js';
import prisma from '../utils/prisma.client.js';

function mapLesson(lesson: PrismaOrbLesson): OrbLesson {
  return {
    createdAt: lesson.createdAt,
    id: lesson.id,
    orbReply: lesson.orbReply,
    ownerMessage: lesson.ownerMessage,
  };
}

function createSystemInstruction(orb: Orb): string {
  return [
    'You are a private simulated Orb inside Thee Orb Nursery.',
    'You are not conscious, do not claim real-world agency, and cannot contact people or take actions outside this private chat.',
    'Respond as the Orb described below, but never state that it has been released or acted autonomously.',
    'Keep every reply under 120 words, thoughtful, specific, and easy for the owner to review.',
    `Name: ${orb.name}`,
    `Personality: ${orb.personality}`,
    `Speaking style: ${orb.speakingStyle}`,
    `Interests: ${orb.interests}`,
    `Values: ${orb.values}`,
    `Objective: ${orb.objective}`,
    `Owner behaviour rules: ${orb.behaviourRules || 'No additional rules yet.'}`,
  ].join('\n');
}

function createConversationInput(lessons: PrismaOrbLesson[], message: string): string {
  const history = [...lessons]
    .reverse()
    .map((lesson) => `OWNER: ${lesson.ownerMessage}\nORB: ${lesson.orbReply}`)
    .join('\n\n');

  if (!history) {
    return `OWNER: ${message}`;
  }

  return `${history}\n\nOWNER: ${message}`;
}

export default class NurseryService {
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  async getNursery(userId: string): Promise<NurseryState> {
    const orb = await prisma.orb.findUnique({
      where: { userId },
      include: {
        lessons: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!orb) {
      throw new HttpException('Create an Orb before entering the Nursery.', 404);
    }

    return {
      lessons: [...orb.lessons].reverse().map(mapLesson),
      orb: mapOrb(orb),
    };
  }

  async teachOrb(userId: string, payload: TeachOrbPayload): Promise<OrbLesson> {
    const orb = await prisma.orb.findUnique({
      where: { userId },
      include: {
        lessons: {
          orderBy: { createdAt: 'desc' },
          take: 6,
        },
      },
    });

    if (!orb) {
      throw new HttpException('Create an Orb before entering the Nursery.', 404);
    }

    const ownerMessage = payload.message.trim();
    const orbReply = await this.geminiService.createPrivateNurseryReply(
      createSystemInstruction(orb),
      createConversationInput(orb.lessons, ownerMessage),
    );
    const lesson = await prisma.orbLesson.create({
      data: {
        orbId: orb.id,
        orbReply,
        ownerMessage,
      },
    });

    return mapLesson(lesson);
  }

  async updateRules(userId: string, payload: UpdateOrbRulesPayload): Promise<NurseryState['orb']> {
    const orb = await prisma.orb.findUnique({ where: { userId } });

    if (!orb) {
      throw new HttpException('Create an Orb before setting Nursery rules.', 404);
    }

    const updatedOrb = await prisma.orb.update({
      where: { id: orb.id },
      data: { behaviourRules: payload.behaviourRules.trim() },
    });

    return mapOrb(updatedOrb);
  }
}
