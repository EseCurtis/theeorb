import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

import Env from '../../config/env.config.js';
import { HttpException } from '../../utils/exceptions.util.js';

type GmailTokenResponse = {
  access_token?: unknown;
  expires_in?: unknown;
  refresh_token?: unknown;
  scope?: unknown;
};

type GmailProfileResponse = {
  emailAddress?: unknown;
};

export type GmailTokens = {
  accessToken: string;
  expiresAt: Date;
  refreshToken: string;
  scope: string;
};

function parseGmailTokens(payload: unknown, fallbackRefreshToken?: string): GmailTokens {
  if (!payload || typeof payload !== 'object') {
    throw new HttpException('Gmail connection is unavailable. Try again later.', 503);
  }

  const token = payload as GmailTokenResponse;

  if (typeof token.access_token !== 'string' || !token.access_token || (typeof token.refresh_token !== 'string' && !fallbackRefreshToken)) {
    throw new HttpException('Gmail connection is unavailable. Try again later.', 503);
  }

  return {
    accessToken: token.access_token,
    expiresAt: new Date(Date.now() + (typeof token.expires_in === 'number' ? token.expires_in : 3600) * 1000),
    refreshToken: typeof token.refresh_token === 'string' ? token.refresh_token : fallbackRefreshToken ?? '',
    scope: typeof token.scope === 'string' ? token.scope : 'https://www.googleapis.com/auth/gmail.send',
  };
}

export default class GmailService {
  public createAuthorizationUrl(state: string): string {
    this.requireConfiguration();
    const params = new URLSearchParams({
      access_type: 'offline',
      client_id: Env.GMAIL_CLIENT_ID,
      include_granted_scopes: 'true',
      prompt: 'consent',
      redirect_uri: Env.GMAIL_REDIRECT_URI,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/gmail.send',
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  public async exchangeAuthorizationCode(code: string): Promise<GmailTokens & { gmailAddress: string }> {
    this.requireConfiguration();
    const response = await fetch('https://oauth2.googleapis.com/token', {
      body: new URLSearchParams({
        client_id: Env.GMAIL_CLIENT_ID,
        client_secret: Env.GMAIL_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: Env.GMAIL_REDIRECT_URI,
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
    });

    if (!response.ok) {
      throw new HttpException('Gmail connection is unavailable. Try again later.', 503);
    }

    const tokens = parseGmailTokens(await response.json());
    const gmailAddress = await this.getGmailAddress(tokens.accessToken);

    return { ...tokens, gmailAddress };
  }

  public async refreshAccessToken(refreshToken: string): Promise<GmailTokens> {
    this.requireConfiguration();
    const response = await fetch('https://oauth2.googleapis.com/token', {
      body: new URLSearchParams({
        client_id: Env.GMAIL_CLIENT_ID,
        client_secret: Env.GMAIL_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
    });

    if (!response.ok) {
      throw new HttpException('Gmail connection needs to be reconnected.', 503);
    }

    return parseGmailTokens(await response.json(), refreshToken);
  }

  public async sendMessage(accessToken: string, rawMessage: string): Promise<string> {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      body: JSON.stringify({ raw: Buffer.from(rawMessage).toString('base64url') }),
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      method: 'POST',
    });

    if (!response.ok) {
      throw new HttpException('Gmail could not send this application. Try again later.', 503);
    }

    const payload: unknown = await response.json();

    if (!payload || typeof payload !== 'object' || !('id' in payload) || typeof payload.id !== 'string') {
      throw new HttpException('Gmail could not confirm this application send. Try again later.', 503);
    }

    return payload.id;
  }

  public encrypt(value: string): string {
    const key = this.getEncryptionKey();
    const initializationVector = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, initializationVector);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);

    return Buffer.concat([initializationVector, cipher.getAuthTag(), encrypted]).toString('base64url');
  }

  public decrypt(value: string): string {
    const key = this.getEncryptionKey();
    const encrypted = Buffer.from(value, 'base64url');
    const initializationVector = encrypted.subarray(0, 12);
    const authTag = encrypted.subarray(12, 28);
    const content = encrypted.subarray(28);
    const decipher = createDecipheriv('aes-256-gcm', key, initializationVector);

    decipher.setAuthTag(authTag);

    return Buffer.concat([decipher.update(content), decipher.final()]).toString('utf8');
  }

  public hashState(state: string): string {
    return createHash('sha256').update(state).digest('hex');
  }

  public createState(): string {
    return randomBytes(32).toString('base64url');
  }

  private async getGmailAddress(accessToken: string): Promise<string> {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new HttpException('Gmail connection is unavailable. Try again later.', 503);
    }

    const payload: unknown = await response.json();

    if (!payload || typeof payload !== 'object' || typeof (payload as GmailProfileResponse).emailAddress !== 'string') {
      throw new HttpException('Gmail connection is unavailable. Try again later.', 503);
    }

    return (payload as GmailProfileResponse).emailAddress as string;
  }

  private getEncryptionKey(): Buffer {
    if (!Env.GMAIL_TOKEN_ENCRYPTION_KEY) {
      throw new HttpException('Gmail connection is unavailable. Try again later.', 503);
    }

    const key = Buffer.from(Env.GMAIL_TOKEN_ENCRYPTION_KEY, 'base64');

    if (key.length !== 32) {
      throw new HttpException('Gmail connection is unavailable. Try again later.', 503);
    }

    return key;
  }

  private requireConfiguration(): void {
    if (!Env.GMAIL_CLIENT_ID || !Env.GMAIL_CLIENT_SECRET || !Env.GMAIL_REDIRECT_URI) {
      throw new HttpException('Gmail connection is unavailable. Try again later.', 503);
    }
  }
}
