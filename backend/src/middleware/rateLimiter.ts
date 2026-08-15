import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../utils/apiResponse';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);

export const generalRateLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  handler: (_req, res) => {
    ApiResponse.error(
      res,
      'Too many requests from this IP. Please try again after 15 minutes.',
      'TOO_MANY_REQUESTS',
      429
    );
  },
});

export const refreshRateLimiter = rateLimit({
  windowMs,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  handler: (_req, res) => {
    ApiResponse.error(
      res,
      'Too many refresh API requests. Please try again after 15 minutes.',
      'REFRESH_RATE_LIMIT_EXCEEDED',
      429
    );
  },
});
