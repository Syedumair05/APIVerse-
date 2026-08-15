import { CacheModel } from '../models/Cache';
import { getDbStatus } from '../config/database';
import { logger } from '../utils/logger';

interface InMemoryCacheEntry {
  data: unknown;
  expiresAt: number;
}

// Fallback in-memory cache when MongoDB is offline
const inMemoryCache = new Map<string, InMemoryCacheEntry>();

export class CacheService {
  static async get<T>(key: string): Promise<{ data: T; lastUpdated?: string } | null> {
    const { connected } = getDbStatus();

    if (connected) {
      try {
        const cachedDoc = await CacheModel.findOne({ key });
        if (cachedDoc && cachedDoc.expiresAt.getTime() > Date.now()) {
          return {
            data: cachedDoc.data as T,
            lastUpdated: cachedDoc.updatedAt.toISOString(),
          };
        }
      } catch (err) {
        logger.warn('Cache lookup failed on MongoDB, falling back to in-memory cache.', err);
      }
    }

    // In-memory fallback lookup
    const entry = inMemoryCache.get(key);
    if (entry && entry.expiresAt > Date.now()) {
      return {
        data: entry.data as T,
        lastUpdated: new Date(entry.expiresAt).toISOString(),
      };
    }

    return null;
  }

  static async set(key: string, data: unknown, ttlMinutes = 1440): Promise<void> {
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
    const { connected } = getDbStatus();

    // Store in in-memory map
    inMemoryCache.set(key, {
      data,
      expiresAt: expiresAt.getTime(),
    });

    if (connected) {
      try {
        await CacheModel.findOneAndUpdate(
          { key },
          { key, data, expiresAt },
          { upsert: true, new: true }
        );
      } catch (err) {
        logger.warn('Failed to persist cache into MongoDB.', err);
      }
    }
  }

  static async invalidate(key: string): Promise<void> {
    inMemoryCache.delete(key);
    const { connected } = getDbStatus();
    if (connected) {
      try {
        await CacheModel.deleteOne({ key });
      } catch (err) {
        logger.warn('Failed to delete cache key from MongoDB.', err);
      }
    }
  }
}
