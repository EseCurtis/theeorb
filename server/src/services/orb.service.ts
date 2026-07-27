import type { Orb } from '@prisma/client';

import type { CreateOrbPayload, OrbIdentity, OrbVisualForm } from '../types/orb.types.js';
import { HttpException } from '../utils/exceptions.util.js';
import prisma from '../utils/prisma.client.js';

function mapVisualForm(visualForm: string): OrbVisualForm {
  if (visualForm === 'ECLIPSE' || visualForm === 'LUMEN' || visualForm === 'NOVA') {
    return visualForm;
  }

  throw new Error('Stored Orb visual form is invalid');
}

function mapOrb(orb: Orb): OrbIdentity {
  return {
    id: orb.id,
    interests: orb.interests,
    name: orb.name,
    objective: orb.objective,
    personality: orb.personality,
    releaseStatus: 'DRAFT',
    speakingStyle: orb.speakingStyle,
    values: orb.values,
    visualForm: mapVisualForm(orb.visualForm),
  };
}

export default class OrbService {
  async createOrb(userId: string, payload: CreateOrbPayload): Promise<OrbIdentity> {
    const existingOrb = await prisma.orb.findUnique({ where: { userId } });

    if (existingOrb) {
      throw new HttpException('Your Orb has already awakened. Edit it from the Nursery.', 409);
    }

    const orb = await prisma.orb.create({
      data: {
        interests: payload.interests.trim(),
        name: payload.name.trim(),
        objective: payload.objective.trim(),
        personality: payload.personality.trim(),
        speakingStyle: payload.speakingStyle.trim(),
        userId,
        values: payload.values.trim(),
        visualForm: payload.visualForm,
      },
    });

    return mapOrb(orb);
  }

  async getOrb(userId: string): Promise<OrbIdentity | null> {
    const orb = await prisma.orb.findUnique({ where: { userId } });

    return orb ? mapOrb(orb) : null;
  }
}
