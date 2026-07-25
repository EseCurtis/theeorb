import type { NextFunction, Request, Response } from 'express';

import logger from '../helpers/logger.js';

export function requestLogger(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const startedAt = Date.now();

  response.on('finish', () => {
    logger.info(
      `${request.method} ${request.originalUrl} ${response.statusCode} ${Date.now() - startedAt}ms`,
    );
  });

  next();
}
