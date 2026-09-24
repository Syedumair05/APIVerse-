import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';
import { ApiResponse } from '../utils/apiResponse';

export class AnalyticsController {
  static getOverview = async (_req: Request, res: Response) => {
    const overview = await AnalyticsService.getOverviewAnalytics();
    return ApiResponse.success(res, overview, 'Overview analytics generated successfully');
  };

  static getRegionAnalytics = async (_req: Request, res: Response) => {
    const regionData = await AnalyticsService.getRegionAnalytics();
    return ApiResponse.success(res, regionData, 'Region analytics generated successfully');
  };

  static getTopPopulation = async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const topPop = await AnalyticsService.getTopPopulatedCountries(limit);
    return ApiResponse.success(res, topPop, `Top ${topPop.length} most populous countries`);
  };

  static getTopArea = async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const topArea = await AnalyticsService.getTopAreaCountries(limit);
    return ApiResponse.success(res, topArea, `Top ${topArea.length} largest countries by land area`);
  };
}
