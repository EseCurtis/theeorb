export type OrbVisualForm = 'ECLIPSE' | 'LUMEN' | 'NOVA';

export type CreateOrbPayload = {
  name: string;
  personality: string;
  interests: string;
  values: string;
  speakingStyle: string;
  objective: string;
  visualForm: OrbVisualForm;
};

export type OrbIdentity = CreateOrbPayload & {
  behaviourRules: string;
  id: string;
  releaseStatus: 'DRAFT';
};

export type OrbLesson = {
  createdAt: Date;
  id: string;
  orbReply: string;
  ownerMessage: string;
};

export type NurseryState = {
  lessons: OrbLesson[];
  orb: OrbIdentity;
};

export type TeachOrbPayload = {
  message: string;
};

export type UpdateOrbRulesPayload = {
  behaviourRules: string;
};
