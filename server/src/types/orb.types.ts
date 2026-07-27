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
  id: string;
  releaseStatus: 'DRAFT';
};
