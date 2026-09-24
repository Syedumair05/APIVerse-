import { Request, Response } from 'express';
import { CacheService } from '../services/cacheService';
import { researchMetrics } from '../services/researchService';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';

export class ResearchController {
  static getStats = async (_req: Request, res: Response) => {
    const isResearchMode = process.env.RESEARCH_MODE === 'true';
    if (!isResearchMode) {
      throw new AppError('Research metrics endpoint is active only when RESEARCH_MODE=true.', 403, 'RESEARCH_MODE_DISABLED');
    }

    const stats = researchMetrics.getStats();
    return ApiResponse.success(res, stats, 'Research experiment statistics retrieved successfully.');
  };

  static clearCache = async (req: Request, res: Response) => {
    const researchSecret = process.env.RESEARCH_SECRET;
    const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
    const isResearchMode = process.env.RESEARCH_MODE === 'true';
    const providedKey = req.headers['x-research-key'] || req.query.secret;

    // Protection check
    const isAuthorized =
      (researchSecret && providedKey === researchSecret) ||
      (isDev && isResearchMode);

    if (!isAuthorized) {
      throw new AppError('Access denied: Research cache clear endpoint is restricted.', 403, 'RESEARCH_ENDPOINT_RESTRICTED');
    }

    const result = await CacheService.clearAll();
    return ApiResponse.success(
      res,
      result,
      'Research experimental control: All backend cache layers (MongoDB) and research metrics cleared successfully.'
    );
  };
}
