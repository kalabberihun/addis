import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './error.middleware';

/**
 * Factory that returns an Express middleware validating `req.body` against a Zod schema.
 * If validation fails, an `AppError` with status 400 is passed to the next error handler.
 */
export const validateBody = (schema: ZodSchema<any>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Zod throws on parse failures – we catch to forward a proper error.
      schema.parse(req.body);
      next();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid request body';
      next(new AppError(message, 400));
    }
  };
};

// Similar helper for query params, if needed later.
export const validateQuery = (schema: ZodSchema<any>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid query parameters';
      next(new AppError(message, 400));
    }
  };
};
