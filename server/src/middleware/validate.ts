import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';

import SendResponse from '../utils/response.util.js';

type RequestWithOptionalUser = Request & {
  user?: unknown;
};

export function validate(schema: ZodTypeAny) {
  return (request: RequestWithOptionalUser, response: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
      user: request.user,
    });

    if (!result.success) {
      const respond = new SendResponse(response);

      respond
        .status(400)
        .success(false)
        .code(400)
        .desc(result.error.issues[0]?.message ?? 'Invalid request')
        .responseData({ issues: result.error.issues })
        .send();

      return;
    }

    next();
  };
}
