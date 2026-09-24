import { Request, Response } from 'express';
import { FavoriteService } from '../services/favoriteService';
import { ApiResponse } from '../utils/apiResponse';

export class FavoriteController {
  static getFavorites = async (_req: Request, res: Response) => {
    const favorites = await FavoriteService.getFavorites();
    return ApiResponse.success(res, favorites, 'User favorites retrieved successfully');
  };

  static addFavorite = async (req: Request, res: Response) => {
    const { countryCode, countryName } = req.body;
    const favorite = await FavoriteService.addFavorite(countryCode, countryName);
    return ApiResponse.success(res, favorite, 'Country added to favorites successfully', undefined, 201);
  };

  static removeFavorite = async (req: Request, res: Response) => {
    const { countryCode } = req.params;
    const removed = await FavoriteService.removeFavorite(countryCode);
    return ApiResponse.success(res, removed, 'Country removed from favorites successfully');
  };
}
