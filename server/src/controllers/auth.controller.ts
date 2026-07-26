import type { Request, Response } from 'express';

import AuthService from '../services/auth.service.js';
import type {
  AuthenticatedUser,
  PasswordRecoveryPayload,
  PasswordResetPayload,
  SignInPayload,
  SignUpPayload,
} from '../types/auth.types.js';
import { HttpException } from '../utils/exceptions.util.js';
import SendResponse from '../utils/response.util.js';

function isAuthenticatedUser(user: unknown): user is AuthenticatedUser {
  if (
    !user ||
    typeof user !== 'object' ||
    !('id' in user) ||
    !('email' in user) ||
    !('displayName' in user) ||
    typeof user.id !== 'string' ||
    typeof user.email !== 'string' ||
    typeof user.displayName !== 'string'
  ) {
    return false;
  }

  return true;
}

function getAuthenticatedRequestUser(request: Request): AuthenticatedUser {
  if (!isAuthenticatedUser(request.user)) {
    throw new HttpException('Authentication required', 401);
  }

  return request.user;
}

export default class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  signUp = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    await this.authService.signUp(request.body as SignUpPayload);

    return respond
      .status(202)
      .success(true)
      .code(202)
      .desc('If eligible, your account is ready to sign in')
      .send();
  };

  signIn = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const session = await this.authService.signIn(request.body as SignInPayload);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Signed in successfully')
      .responseData(session)
      .send();
  };

  requestPasswordRecovery = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    await this.authService.requestPasswordRecovery(request.body as PasswordRecoveryPayload);

    return respond
      .status(202)
      .success(true)
      .code(202)
      .desc('If that account exists, a recovery link has been sent')
      .send();
  };

  resetPassword = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    await this.authService.resetPassword(request.body as PasswordResetPayload);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Password updated successfully')
      .send();
  };

  getSession = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    const user = getAuthenticatedRequestUser(request);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Session retrieved successfully')
      .responseData({ user })
      .send();
  };

  signOut = async (request: Request, response: Response): Promise<Response> => {
    const respond = new SendResponse(response);
    getAuthenticatedRequestUser(request);

    return respond
      .status(200)
      .success(true)
      .code(200)
      .desc('Signed out successfully')
      .send();
  };
}
