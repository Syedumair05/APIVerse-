import { Response } from 'express';
import { ApiErrorResponse, ApiSuccessResponse, PaginationMeta } from '../types/api';

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    pagination?: PaginationMeta,
    statusCode = 200,
    lastUpdated?: string
  ): Response<ApiSuccessResponse<T>> {
    const payload: ApiSuccessResponse<T> = {
      success: true,
      data,
    };
    if (message) payload.message = message;
    if (pagination) payload.pagination = pagination;
    if (lastUpdated) payload.lastUpdated = lastUpdated;

    return res.status(statusCode).json(payload);
  }

  static error(
    res: Response,
    message: string,
    code = 'BAD_REQUEST',
    statusCode = 400,
    details?: unknown
  ): Response<ApiErrorResponse> {
    const payload: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
      },
    };
    if (details) payload.error.details = details;

    return res.status(statusCode).json(payload);
  }
}
