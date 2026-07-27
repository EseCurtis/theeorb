import Env from '../../config/env.config.js';
import logger from '../../helpers/logger.js';
import type { GeminiCompatibilityEvaluation } from '../../types/matching.types.js';
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

function isCompatibilityEvaluation(value: unknown): value is GeminiCompatibilityEvaluation {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.compatibilityScore === 'number' &&
    Array.isArray(value.highlights) &&
    value.highlights.every((highlight) => typeof highlight === 'string') &&
    typeof value.shouldRecommend === 'boolean' &&
    typeof value.summary === 'string' &&
    typeof value.turnCount === 'number'
  );
}

function parseCompatibilityEvaluation(text: string): GeminiCompatibilityEvaluation | null {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
    return null;
  }

  try {
    const evaluation: unknown = JSON.parse(text.slice(firstBrace, lastBrace + 1));

    if (!isCompatibilityEvaluation(evaluation)) {
      return null;
    }

    return {
      compatibilityScore: Math.max(0, Math.min(100, Math.round(evaluation.compatibilityScore))),
      highlights: evaluation.highlights.slice(0, 3).map((highlight) => highlight.trim()).filter(Boolean),
      shouldRecommend: evaluation.shouldRecommend,
      summary: evaluation.summary.trim().slice(0, 500),
      turnCount: Math.max(1, Math.min(8, Math.round(evaluation.turnCount))),
    };
  } catch {
    return null;
  }
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

  async evaluateOrbCompatibility(input: string): Promise<GeminiCompatibilityEvaluation> {
    const systemInstruction = [
      'You evaluate a private compatibility session for TheeOrb, an adults-only dating and friendship platform.',
      'Simulate a respectful conversation between the two supplied Orbs for at most eight turns. They may decide early.',
      'Do not claim sentience, certainty, or access to undisclosed information. Do not reveal contact details or precise location.',
      'Return JSON only with shouldRecommend (boolean), compatibilityScore (0-100), summary (owner-safe, under 90 words), highlights (up to 3 strings), and turnCount (1-8).',
      'Recommend only when both Orbs identify a specific, respectful reason to introduce their owners.',
    ].join('\n');
    const reply = await this.createPrivateNurseryReply(systemInstruction, input);
    const evaluation = parseCompatibilityEvaluation(reply);

    if (!evaluation || !evaluation.summary || !evaluation.highlights.length) {
      logger.error({ provider: 'gemini', reason: 'Compatibility response did not match the expected shape' });
      throw new HttpException('Compatibility evaluation is unavailable. Try again later.', 503);
    }

    return evaluation;
  }
}
