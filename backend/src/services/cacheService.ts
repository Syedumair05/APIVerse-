import { CacheModel } from '../models/Cache';
import { getDbStatus } from '../config/database';
import { logger } from '../utils/logger';
import { researchMetrics } from './researchService';
import { AppError } from '../middleware/errorHandler';

interface InMemoryCacheEntry {
  data: unknown;
  expiresAt: number;
}

// Fallback in-memory cache for normal non-research operation
const inMemoryCache = new Map<string, InMemoryCacheEntry>();

export class CacheService {
  static async get<T>(key: string): Promise<{ data: T; lastUpdated?: string; store: 'MONGODB' | 'IN_MEMORY'; unavailable?: boolean } | null> {
    const isResearchMode = process.env.RESEARCH_MODE === 'true';

    // --- RESEARCH MODE CACHING LOGIC ---
    if (isResearchMode) {
      const rawMode = (process.env.CACHE_MODE || 'DUAL').toUpperCase();
      if (rawMode === 'NO_CACHE' || rawMode === 'NONE') {
        return null; // Cache disabled in research mode
      }

      const { connected } = getDbStatus();
      if (!connected) {
        researchMetrics.increment('backendCacheMisses');
        throw new AppError('MongoDB backend cache is unavailable in RESEARCH_MODE.', 503, 'BACKEND_CACHE_UNAVAILABLE');
      }

      try {
        const cachedDoc = await CacheModel.findOne({ key });
        if (cachedDoc && cachedDoc.expiresAt.getTime() > Date.now()) {
          researchMetrics.increment('backendCacheHits');
          return {
            data: cachedDoc.data as T,
            lastUpdated: cachedDoc.updatedAt.toISOString(),
            store: 'MONGODB',
          };
        }
      } catch (err) {
        researchMetrics.increment('backendCacheMisses');
        logger.error('MongoDB cache lookup failed in RESEARCH_MODE.', err);
        throw new AppError('MongoDB backend cache lookup failed in RESEARCH_MODE.', 503, 'BACKEND_CACHE_UNAVAILABLE');
      }

      // MongoDB miss in research mode (No in-memory fallback permitted)
      researchMetrics.increment('backendCacheMisses');
      return null;
    }

    // --- NORMAL APPLICATION MODE (Non-Research) ---
    const { connected } = getDbStatus();
    let mongoErrorOccurred = false;

    if (connected) {
      try {
        const cachedDoc = await CacheModel.findOne({ key });
        if (cachedDoc && cachedDoc.expiresAt.getTime() > Date.now()) {
          return {
            data: cachedDoc.data as T,
            lastUpdated: cachedDoc.updatedAt.toISOString(),
            store: 'MONGODB',
          };
        }
      } catch (err) {
        mongoErrorOccurred = true;
        logger.warn('Cache lookup failed on MongoDB, falling back to in-memory cache.', err);
      }
    }

    // In-memory fallback lookup for normal mode
    try {
      const entry = inMemoryCache.get(key);
      if (entry && entry.expiresAt > Date.now()) {
        return {
          data: entry.data as T,
          lastUpdated: new Date(entry.expiresAt).toISOString(),
          store: 'IN_MEMORY',
          unavailable: mongoErrorOccurred,
        };
      }
    } catch (err) {
      logger.warn('In-memory cache lookup failed.', err);
      return null;
    }

    return null;
  }

  static async set(key: string, data: unknown, ttlMinutes = 1440): Promise<void> {
    const isResearchMode = process.env.RESEARCH_MODE === 'true';
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    if (isResearchMode) {
      const { connected } = getDbStatus();
      if (connected) {
        try {
          await CacheModel.findOneAndUpdate(
            { key },
            { key, data, expiresAt },
            { upsert: true, new: true }
          );
          researchMetrics.increment('backendCacheWrites');
        } catch (err) {
          logger.error('Failed to write to MongoDB cache in RESEARCH_MODE.', err);
          throw new AppError('Failed to persist to MongoDB cache in RESEARCH_MODE.', 500, 'CACHE_WRITE_FAILURE');
        }
      } else {
        throw new AppError('MongoDB connection offline, cannot write cache in RESEARCH_MODE.', 503, 'BACKEND_CACHE_UNAVAILABLE');
      }
      return;
    }

    // --- NORMAL APPLICATION MODE (Non-Research) ---
    inMemoryCache.set(key, {
      data,
      expiresAt: expiresAt.getTime(),
    });

    const { connected } = getDbStatus();
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

  static async clearAll(): Promise<{ inMemoryCleared: boolean; mongoDBCleared: boolean }> {
    inMemoryCache.clear();
    let mongoDBCleared = false;
    const { connected } = getDbStatus();
    if (connected) {
      try {
        await CacheModel.deleteMany({});
        mongoDBCleared = true;
      } catch (err) {
        logger.warn('Failed to clear MongoDB CacheModel collection.', err);
      }
    }
    researchMetrics.resetStats();
    return { inMemoryCleared: true, mongoDBCleared };
  }
}
