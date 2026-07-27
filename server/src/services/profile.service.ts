import type { DatingProfile, ProfilePhoto } from '@prisma/client';

import CloudinaryService from './plugins/cloudinary.service.js';
import type {
  DatingProfilePayload,
  ProfilePhotoPayload,
  ReorderPhotosPayload,
} from '../types/matching.types.js';
import { HttpException } from '../utils/exceptions.util.js';
import prisma from '../utils/prisma.client.js';

const MINIMUM_PROFILE_PHOTOS = 4;
const MAXIMUM_PROFILE_PHOTOS = 6;

type ProfileWithPhotos = DatingProfile & {
  photos: ProfilePhoto[];
};

function mapPhoto(photo: ProfilePhoto): { id: string; position: number; secureUrl: string } {
  return {
    id: photo.id,
    position: photo.position,
    secureUrl: photo.secureUrl,
  };
}

function mapProfile(profile: ProfileWithPhotos): Record<string, unknown> {
  return {
    bio: profile.bio,
    city: profile.city,
    completedAt: profile.completedAt,
    dateOfBirth: profile.dateOfBirth,
    genderIdentity: profile.genderIdentity,
    interestedIn: JSON.parse(profile.interestedIn) as string[],
    intents: JSON.parse(profile.intents) as string[],
    isDiscoverable: profile.isDiscoverable,
    latitude: profile.latitude,
    lifestyle: JSON.parse(profile.lifestyle) as Record<string, string>,
    longitude: profile.longitude,
    maximumAge: profile.maximumAge,
    maximumDistanceKm: profile.maximumDistanceKm,
    minimumAge: profile.minimumAge,
    photos: profile.photos.map(mapPhoto),
    prompts: JSON.parse(profile.prompts) as unknown[],
    sexualOrientation: profile.sexualOrientation,
  };
}

function profileData(payload: DatingProfilePayload): Omit<DatingProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'completedAt'> {
  return {
    bio: payload.bio.trim(),
    city: payload.city.trim(),
    dateOfBirth: payload.dateOfBirth,
    genderIdentity: payload.genderIdentity.trim(),
    interestedIn: JSON.stringify(payload.interestedIn),
    intents: JSON.stringify(payload.intents),
    isDiscoverable: payload.isDiscoverable,
    latitude: payload.latitude,
    lifestyle: JSON.stringify(payload.lifestyle ?? {}),
    longitude: payload.longitude,
    maximumAge: payload.maximumAge,
    maximumDistanceKm: payload.maximumDistanceKm,
    minimumAge: payload.minimumAge,
    prompts: JSON.stringify(payload.prompts),
    sexualOrientation: payload.sexualOrientation.trim(),
  };
}

export default class ProfileService {
  private cloudinaryService: CloudinaryService;

  public constructor() {
    this.cloudinaryService = new CloudinaryService();
  }

  public async getProfile(userId: string): Promise<Record<string, unknown> | null> {
    const profile = await prisma.datingProfile.findUnique({
      where: { userId },
      include: { photos: { orderBy: { position: 'asc' } } },
    });

    return profile ? mapProfile(profile) : null;
  }

  public async saveProfile(userId: string, payload: DatingProfilePayload): Promise<Record<string, unknown>> {
    const profile = await prisma.datingProfile.upsert({
      where: { userId },
      create: {
        ...profileData(payload),
        userId,
      },
      update: profileData(payload),
      include: { photos: { orderBy: { position: 'asc' } } },
    });
    const completedAt = profile.photos.length >= MINIMUM_PROFILE_PHOTOS ? new Date() : null;
    const updatedProfile = await prisma.datingProfile.update({
      where: { id: profile.id },
      data: { completedAt },
      include: { photos: { orderBy: { position: 'asc' } } },
    });

    return mapProfile(updatedProfile);
  }

  public async createPhotoUploadSignature(userId: string): Promise<Record<string, unknown>> {
    const profile = await prisma.datingProfile.findUnique({ where: { userId } });

    if (!profile) {
      throw new HttpException('Complete your matching profile before adding photos.', 409);
    }

    return this.cloudinaryService.createProfilePhotoSignature(userId);
  }

  public async addPhoto(userId: string, payload: ProfilePhotoPayload): Promise<Record<string, unknown>> {
    const profile = await prisma.datingProfile.findUnique({
      where: { userId },
      include: { photos: true },
    });

    if (!profile) {
      throw new HttpException('Complete your matching profile before adding photos.', 409);
    }

    if (!this.cloudinaryService.isOwnedProfilePhoto(userId, payload.cloudinaryId, payload.secureUrl)) {
      throw new HttpException('That photo upload could not be verified.', 400);
    }

    const existingPhoto = profile.photos.find((photo) => photo.cloudinaryId === payload.cloudinaryId);

    if (!existingPhoto && profile.photos.length >= MAXIMUM_PROFILE_PHOTOS) {
      throw new HttpException('You can add up to six profile photos.', 409);
    }

    const photo = await prisma.profilePhoto.upsert({
      where: { cloudinaryId: payload.cloudinaryId },
      create: {
        cloudinaryId: payload.cloudinaryId,
        datingProfileId: profile.id,
        position: payload.position,
        secureUrl: payload.secureUrl,
      },
      update: {
        position: payload.position,
        secureUrl: payload.secureUrl,
      },
    });
    const photoCount = existingPhoto ? profile.photos.length : profile.photos.length + 1;
    const completedAt = photoCount >= MINIMUM_PROFILE_PHOTOS ? new Date() : null;

    await prisma.datingProfile.update({
      where: { id: profile.id },
      data: { completedAt },
    });

    return mapPhoto(photo);
  }

  public async reorderPhotos(userId: string, payload: ReorderPhotosPayload): Promise<Record<string, unknown>[]> {
    const profile = await prisma.datingProfile.findUnique({
      where: { userId },
      include: { photos: { orderBy: { position: 'asc' } } },
    });

    if (!profile) {
      throw new HttpException('Matching profile not found.', 404);
    }

    const existingPhotoIds = profile.photos.map((photo) => photo.id).sort();
    const requestedPhotoIds = [...payload.photoIds].sort();

    if (
      existingPhotoIds.length !== requestedPhotoIds.length ||
      existingPhotoIds.some((photoId, index) => photoId !== requestedPhotoIds[index])
    ) {
      throw new HttpException('Use the photos currently on your profile.', 400);
    }

    await prisma.$transaction(
      payload.photoIds.map((photoId, position) =>
        prisma.profilePhoto.update({
          where: { id: photoId },
          data: { position: position + MAXIMUM_PROFILE_PHOTOS },
        }),
      ),
    );
    await prisma.$transaction(
      payload.photoIds.map((photoId, position) =>
        prisma.profilePhoto.update({
          where: { id: photoId },
          data: { position },
        }),
      ),
    );
    const photos = await prisma.profilePhoto.findMany({
      where: { datingProfileId: profile.id },
      orderBy: { position: 'asc' },
    });

    return photos.map(mapPhoto);
  }

  public async removePhoto(userId: string, photoId: string): Promise<void> {
    const profile = await prisma.datingProfile.findUnique({
      where: { userId },
      include: { photos: true },
    });

    if (!profile || !profile.photos.some((photo) => photo.id === photoId)) {
      throw new HttpException('Photo not found.', 404);
    }

    await prisma.profilePhoto.delete({ where: { id: photoId } });
    const remainingPhotoCount = profile.photos.length - 1;

    if (remainingPhotoCount < MINIMUM_PROFILE_PHOTOS) {
      await prisma.datingProfile.update({
        where: { id: profile.id },
        data: { completedAt: null },
      });
    }
  }
}
