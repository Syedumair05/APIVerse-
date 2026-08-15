import { FavoriteModel, IFavorite } from '../models/Favorite';
import { getDbStatus } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

interface InMemoryFavorite {
  countryCode: string;
  countryName: string;
  userId: string;
  createdAt: Date;
}

const inMemoryFavorites = new Map<string, InMemoryFavorite>();

export class FavoriteService {
  static async getFavorites(userId = 'default_user') {
    const { connected } = getDbStatus();

    if (connected) {
      try {
        const favs = await FavoriteModel.find({ userId }).sort({ createdAt: -1 });
        return favs.map((f) => ({
          countryCode: f.countryCode,
          countryName: f.countryName,
          createdAt: f.createdAt,
        }));
      } catch (err) {
        logger.warn('Failed to fetch favorites from MongoDB, falling back to in-memory.', err);
      }
    }

    return Array.from(inMemoryFavorites.values())
      .filter((f) => f.userId === userId)
      .map((f) => ({
        countryCode: f.countryCode,
        countryName: f.countryName,
        createdAt: f.createdAt,
      }));
  }

  static async addFavorite(countryCode: string, countryName: string, userId = 'default_user') {
    const normalizedCode = countryCode.trim().toUpperCase();
    const { connected } = getDbStatus();

    // Check if already favorited in-memory
    if (inMemoryFavorites.has(`${userId}_${normalizedCode}`)) {
      throw new AppError(`Country '${normalizedCode}' is already in your favorites.`, 400, 'DUPLICATE_FAVORITE');
    }

    inMemoryFavorites.set(`${userId}_${normalizedCode}`, {
      countryCode: normalizedCode,
      countryName,
      userId,
      createdAt: new Date(),
    });

    if (connected) {
      try {
        const existing = await FavoriteModel.findOne({ countryCode: normalizedCode, userId });
        if (existing) {
          throw new AppError(`Country '${normalizedCode}' is already in your favorites.`, 400, 'DUPLICATE_FAVORITE');
        }
        await FavoriteModel.create({
          countryCode: normalizedCode,
          countryName,
          userId,
        });
      } catch (err: unknown) {
        if (err instanceof AppError) throw err;
        logger.warn('Failed to persist favorite to MongoDB.', err);
      }
    }

    return { countryCode: normalizedCode, countryName };
  }

  static async removeFavorite(countryCode: string, userId = 'default_user') {
    const normalizedCode = countryCode.trim().toUpperCase();
    const key = `${userId}_${normalizedCode}`;

    const existedInMemory = inMemoryFavorites.delete(key);
    const { connected } = getDbStatus();

    let existedInDb = false;
    if (connected) {
      try {
        const res = await FavoriteModel.deleteOne({ countryCode: normalizedCode, userId });
        existedInDb = res.deletedCount > 0;
      } catch (err) {
        logger.warn('Failed to delete favorite from MongoDB.', err);
      }
    }

    if (!existedInMemory && !existedInDb && connected) {
      throw new AppError(`Favorite with code '${normalizedCode}' was not found.`, 404, 'FAVORITE_NOT_FOUND');
    }

    return { countryCode: normalizedCode };
  }
}
