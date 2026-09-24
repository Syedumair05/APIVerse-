import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode = 400, code = 'BAD_REQUEST') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  logger.error(err.message, err.stack);

  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.code, err.statusCode);
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.name === 'MongoServerError' && (err as unknown as { code: number }).code === 11000) {
    return ApiResponse.error(res, 'Duplicate entry already exists.', 'DUPLICATE_ENTRY', 400);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return ApiResponse.error(res, err.message, 'VALIDATION_ERROR', 400);
  }

  // Generic 500 internal server error
  const isProduction = process.env.NODE_ENV === 'production';
  const responseMessage = isProduction
    ? 'An unexpected internal server error occurred.'
    : err.message || 'Internal Server Error';

  return ApiResponse.error(res, responseMessage, 'INTERNAL_SERVER_ERROR', 500);
};
