import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../utils/apiResponse';

export const getRateLimitMax = (): number => {
  if (process.env.RESEARCH_MODE === 'true') {
    return parseInt(process.env.RESEARCH_RATE_LIMIT || '10000', 10);
  }
  return parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);
};

export const getRateLimitWindowMs = (): number => {
  if (process.env.RESEARCH_MODE === 'true') {
    return parseInt(process.env.RESEARCH_RATE_WINDOW_MS || '900000', 10);
  }
  return parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);
};

export const generalRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: () => getRateLimitMax(),
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
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: () => (process.env.RESEARCH_MODE === 'true' ? 100 : 5),
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
