import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';

import logger from '../helpers/logger.js';
import { HttpException } from '../utils/exceptions.util.js';
import SendResponse from '../utils/response.util.js';

type AsyncHandler = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<unknown>;

export function CatchErrors(handler: AsyncHandler) {
  return async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await handler(request, response, next);
    } catch (error: unknown) {
      const respond = new SendResponse(response);

      if (error instanceof HttpException) {
        respond
          .status(error.statusCode)
          .success(false)
          .code(error.statusCode)
          .desc(error.message)
          .send();
        return;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaResponse = mapPrismaKnownError(error);

        respond
          .status(prismaResponse.statusCode)
          .success(false)
          .code(prismaResponse.statusCode)
          .desc(prismaResponse.message)
          .send();
        return;
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        respond
          .status(400)
          .success(false)
          .code(400)
          .desc('Invalid database query')
          .send();
        return;
      }

      logger.error(
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : 'Unknown error',
      );

      respond
        .status(500)
        .success(false)
        .code(500)
        .desc('Internal server error')
        .responseData({
          timestamp: new Date().toISOString(),
          path: request.originalUrl,
        })
        .send();
    }
  };
}

function mapPrismaKnownError(
  error: Prisma.PrismaClientKnownRequestError,
): { message: string; statusCode: number } {
  switch (error.code) {
    case 'P2002':
      return { statusCode: 409, message: 'Duplicate value' };
    case 'P2003':
      return { statusCode: 400, message: 'Foreign key constraint failed' };
    case 'P2023':
      return { statusCode: 400, message: 'Invalid ID format' };
    case 'P2025':
      return { statusCode: 404, message: 'Record not found' };
    default:
      return { statusCode: 500, message: 'Database error' };
  }
}
