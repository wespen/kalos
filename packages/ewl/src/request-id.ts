import { NextFunction, Request, Response } from 'express';
import * as httpContext from 'express-http-context';
import { v4 as uuidv4 } from 'uuid';

/**
 * The express handler that injects a generated uuid into the context.
 */
export const requestIdHandler = (req: Request, res: Response, next: NextFunction): void => {
  const requestId: string = uuidv4();
  httpContext.middleware(req, res, next);
  httpContext.set('requestId', requestId);
  next();
};

/**
 * Retrieve the injected request id.
 *
 * @returns The injected request id retrieved from the http context.
 */
export function getRequestIdContext(): string | null {
  const requestId: unknown = httpContext.get('requestId');
  if (requestId) {
    return String(requestId);
  }
  return null;
}
