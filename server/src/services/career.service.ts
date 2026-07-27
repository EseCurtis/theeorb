import type { CareerDocument, CareerProfile } from '@prisma/client';

import CloudinaryService from './plugins/cloudinary.service.js';
import type { CareerDocumentPayload, CareerProfilePayload } from '../types/career.types.js';
import { HttpException } from '../utils/exceptions.util.js';
import prisma from '../utils/prisma.client.js';

function parseJson(value: string): unknown {
  return JSON.parse(value) as unknown;
}

function mapProfile(profile: CareerProfile): Record<string, unknown> {
  return {
    education: parseJson(profile.education),
    experience: parseJson(profile.experience),
    fullName: profile.fullName,
    headline: profile.headline,
    links: parseJson(profile.links),
    location: profile.location,
    phone: profile.phone,
    skills: parseJson(profile.skills),
    summary: profile.summary,
  };
}

function mapDocument(document: CareerDocument): Record<string, unknown> {
  return {
    byteSize: document.byteSize,
    createdAt: document.createdAt,
    id: document.id,
    mimeType: document.mimeType,
    originalFilename: document.originalFilename,
  };
}

export default class CareerService {
  private cloudinaryService: CloudinaryService;

  public constructor() {
    this.cloudinaryService = new CloudinaryService();
  }

  public async getCareerProfile(userId: string): Promise<Record<string, unknown> | null> {
    const profile = await prisma.careerProfile.findUnique({ where: { userId } });

    return profile ? mapProfile(profile) : null;
  }

  public async saveCareerProfile(userId: string, payload: CareerProfilePayload): Promise<Record<string, unknown>> {
    const profile = await prisma.careerProfile.upsert({
      where: { userId },
      create: {
        education: JSON.stringify(payload.education),
        experience: JSON.stringify(payload.experience),
        fullName: payload.fullName.trim(),
        headline: payload.headline.trim(),
        links: JSON.stringify(payload.links),
        location: payload.location?.trim() || null,
        phone: payload.phone?.trim() || null,
        skills: JSON.stringify(payload.skills.map((skill) => skill.trim())),
        summary: payload.summary.trim(),
        userId,
      },
      update: {
        education: JSON.stringify(payload.education),
        experience: JSON.stringify(payload.experience),
        fullName: payload.fullName.trim(),
        headline: payload.headline.trim(),
        links: JSON.stringify(payload.links),
        location: payload.location?.trim() || null,
        phone: payload.phone?.trim() || null,
        skills: JSON.stringify(payload.skills.map((skill) => skill.trim())),
        summary: payload.summary.trim(),
      },
    });
    const documentCount = await prisma.careerDocument.count({ where: { userId } });
    const completedProfile = await prisma.careerProfile.update({
      where: { id: profile.id },
      data: { completedAt: documentCount ? new Date() : null },
    });

    return mapProfile(completedProfile);
  }

  public async createDocumentUploadSignature(userId: string): Promise<Record<string, unknown>> {
    const profile = await prisma.careerProfile.findUnique({ where: { userId } });

    if (!profile) {
      throw new HttpException('Complete your career profile before uploading a CV.', 409);
    }

    return this.cloudinaryService.createDocumentUploadSignature(userId);
  }

  public async saveCareerDocument(userId: string, payload: CareerDocumentPayload): Promise<Record<string, unknown>> {
    if (!this.cloudinaryService.isOwnedDocument(userId, payload.cloudinaryId)) {
      throw new HttpException('That CV upload could not be verified.', 400);
    }

    const document = await prisma.careerDocument.upsert({
      where: { cloudinaryId: payload.cloudinaryId },
      create: { ...payload, userId },
      update: { byteSize: payload.byteSize, mimeType: payload.mimeType, originalFilename: payload.originalFilename },
    });

    await prisma.careerProfile.updateMany({ where: { userId }, data: { completedAt: new Date() } });

    return mapDocument(document);
  }

  public async listCareerDocuments(userId: string): Promise<Record<string, unknown>[]> {
    const documents = await prisma.careerDocument.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });

    return documents.map(mapDocument);
  }
}
