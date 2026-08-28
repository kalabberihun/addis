import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handling middleware
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = err as AppError;
  if (!error.statusCode) {
    // Unexpected errors – treat as 500
    error = new AppError('Internal Server Error', 500);
    console.error('Unexpected error:', err);
  }
  res.status(error.statusCode).json({
    status: 'error',
    message: error.message,
  });
};
