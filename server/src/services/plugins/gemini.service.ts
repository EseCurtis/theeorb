import Env from '../../config/env.config.js';
import logger from '../../helpers/logger.js';
import { HttpException } from '../../utils/exceptions.util.js';

type GeminiInteractionResponse = {
  output_text?: unknown;
};

type GeminiRequest = {
  input: string;
  model: string;
  system_instruction: string;
};

function isGeminiInteractionResponse(payload: unknown): payload is GeminiInteractionResponse {
  return Boolean(payload && typeof payload === 'object' && 'output_text' in payload);
}

function getGeneratedText(payload: unknown): string | null {
  if (!isGeminiInteractionResponse(payload)) {
    return null;
  }

  if (typeof payload.output_text !== 'string' || !payload.output_text.trim()) {
    return null;
  }

  return payload.output_text.trim();
}

export default class GeminiService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = Env.GEMINI_API_KEY;
    this.model = Env.GEMINI_MODEL;
  }

  async createPrivateNurseryReply(systemInstruction: string, input: string): Promise<string> {
    if (!this.apiKey) {
      throw new HttpException('Nursery responses are unavailable. Try again later.', 503);
    }

    const request: GeminiRequest = {
      input,
      model: this.model,
      system_instruction: systemInstruction,
    };
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': this.apiKey,
      },
      method: 'POST',
    });

    if (!response.ok) {
      logger.error({ provider: 'gemini', statusCode: response.status });
      throw new HttpException('Nursery responses are unavailable. Try again later.', 503);
    }

    const generatedText = getGeneratedText(await response.json());

    if (!generatedText) {
      logger.error({ provider: 'gemini', reason: 'Response did not include text output' });
      throw new HttpException('Nursery responses are unavailable. Try again later.', 503);
    }

    return generatedText;
  }
}
