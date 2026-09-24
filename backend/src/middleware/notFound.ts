import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';

export const notFoundHandler = (req: Request, res: Response) => {
  ApiResponse.error(
    res,
    `Cannot ${req.method} ${req.originalUrl}. Route not found on APIVerse backend.`,
    'ROUTE_NOT_FOUND',
    404
  );
};
