import GmailService from './plugins/gmail.service.js';
import { HttpException } from '../utils/exceptions.util.js';
import prisma from '../utils/prisma.client.js';

export default class GmailConnectionService {
  private gmailService: GmailService;

  public constructor() {
    this.gmailService = new GmailService();
  }

  public async createConnectionUrl(userId: string): Promise<string> {
    const state = this.gmailService.createState();

    await prisma.gmailOAuthState.create({
      data: { expiresAt: new Date(Date.now() + 10 * 60 * 1000), stateHash: this.gmailService.hashState(state), userId },
    });

    return this.gmailService.createAuthorizationUrl(state);
  }

  public async completeConnection(code: string, state: string): Promise<void> {
    const oauthState = await prisma.gmailOAuthState.findUnique({ where: { stateHash: this.gmailService.hashState(state) } });

    if (!oauthState || oauthState.consumedAt || oauthState.expiresAt <= new Date()) {
      throw new HttpException('Gmail connection could not be completed. Try again.', 400);
    }

    const tokens = await this.gmailService.exchangeAuthorizationCode(code);

    await prisma.$transaction([
      prisma.gmailOAuthState.update({ where: { id: oauthState.id }, data: { consumedAt: new Date() } }),
      prisma.gmailConnection.upsert({
        where: { userId: oauthState.userId },
        create: { accessTokenExpiresAt: tokens.expiresAt, encryptedAccessToken: this.gmailService.encrypt(tokens.accessToken), encryptedRefreshToken: this.gmailService.encrypt(tokens.refreshToken), gmailAddress: tokens.gmailAddress, scope: tokens.scope, userId: oauthState.userId },
        update: { accessTokenExpiresAt: tokens.expiresAt, encryptedAccessToken: this.gmailService.encrypt(tokens.accessToken), encryptedRefreshToken: this.gmailService.encrypt(tokens.refreshToken), gmailAddress: tokens.gmailAddress, scope: tokens.scope },
      }),
    ]);
  }

  public async getConnection(userId: string): Promise<{ gmailAddress: string } | null> {
    const connection = await prisma.gmailConnection.findUnique({ where: { userId }, select: { gmailAddress: true } });

    return connection;
  }

  public async disconnect(userId: string): Promise<void> {
    await prisma.gmailConnection.deleteMany({ where: { userId } });
  }
}
