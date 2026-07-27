export type ConnectionIntent = 'DATING' | 'FRIENDSHIP';

export type RecommendationDecision = 'ACCEPT' | 'PASS';

export type ProfilePrompt = {
  answer: string;
  prompt: string;
};

export type DatingProfilePayload = {
  bio: string;
  city: string;
  dateOfBirth: Date;
  genderIdentity: string;
  interestedIn: string[];
  intents: ConnectionIntent[];
  isDiscoverable: boolean;
  latitude: number;
  lifestyle?: Record<string, string>;
  longitude: number;
  maximumAge: number;
  maximumDistanceKm: number;
  minimumAge: number;
  prompts: ProfilePrompt[];
  sexualOrientation: string;
};

export type ProfilePhotoPayload = {
  cloudinaryId: string;
  position: number;
  secureUrl: string;
};

export type ReorderPhotosPayload = {
  photoIds: string[];
};

export type RecommendationDecisionPayload = {
  decision: RecommendationDecision;
};

export type ChatMessagePayload = {
  body: string;
};

export type SafetyReportPayload = {
  details?: string;
  reason: string;
};

export type GeminiCompatibilityEvaluation = {
  compatibilityScore: number;
  highlights: string[];
  shouldRecommend: boolean;
  summary: string;
  turnCount: number;
};
