import Env from '../../config/env.config.js';
import logger from '../../helpers/logger.js';
import { HttpException } from '../../utils/exceptions.util.js';

type GeminiInteractionResponse = {
  output_text?: unknown;
  steps?: unknown;
};

type GeminiRequest = {
  input: string;
  model: string;
  system_instruction: string;
};

function isGeminiInteractionResponse(payload: unknown): payload is GeminiInteractionResponse {
  return Boolean(
    payload &&
      typeof payload === 'object' &&
      ('output_text' in payload || 'steps' in payload),
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object');
}

function getTextFromContent(content: unknown): string | null {
  if (typeof content === 'string' && content.trim()) {
    return content.trim();
  }

  if (!Array.isArray(content)) {
    return null;
  }

  const textParts: string[] = [];

  for (const part of content) {
    if (!isRecord(part) || typeof part.text !== 'string' || !part.text.trim()) {
      continue;
    }

    textParts.push(part.text.trim());
  }

  return textParts.length ? textParts.join('\n') : null;
}

function getTextFromSteps(steps: unknown): string | null {
  if (!Array.isArray(steps)) {
    return null;
  }

  for (let index = steps.length - 1; index >= 0; index -= 1) {
    const step = steps[index];

    if (!isRecord(step)) {
      continue;
    }

    const text = getTextFromContent(step.content);

    if (text) {
      return text;
    }
  }

  return null;
}

function getGeneratedText(payload: unknown): string | null {
  if (!isGeminiInteractionResponse(payload)) {
    return null;
  }

  if (typeof payload.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  return getTextFromSteps(payload.steps);
}


export default class GeminiService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = Env.GEMINI_API_KEY;
    this.model = Env.GEMINI_MODEL;
  }

  async createPrivateNurseryReply(systemInstruction: string, input: string): Promise<string> {
    return this.generateText(systemInstruction, input, 'Nursery responses are unavailable. Try again later.');
  }

  async generateText(systemInstruction: string, input: string, unavailableMessage: string): Promise<string> {
    if (!this.apiKey) {
      throw new HttpException(unavailableMessage, 503);
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
      throw new HttpException(unavailableMessage, 503);
    }

    const generatedText = getGeneratedText(await response.json());

    if (!generatedText) {
      logger.error({ provider: 'gemini', reason: 'Response did not include text output' });
      throw new HttpException(unavailableMessage, 503);
    }

    return generatedText;
  }

}
