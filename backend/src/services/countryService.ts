import axios from 'axios';
import { Country, CountryQueryParams } from '../types/country';
import { CacheService } from './cacheService';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { researchMetrics } from './researchService';
import fallbackDataset from '../data/countriesData.json';

const COUNTRIES_API_URL = process.env.COUNTRIES_API_URL || 'https://restcountries.com/v3.1';
const CACHE_KEY = 'countries_all_data';

export const countriesApiClient = axios.create({
  baseURL: COUNTRIES_API_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'APIVerse-Backend/1.0',
  },
});

export interface CacheMeta {
  status: 'HIT' | 'MISS' | 'DISABLED' | 'UNAVAILABLE';
  store: 'MONGODB' | 'IN_MEMORY' | 'NONE';
  externalApiCalled: boolean;
  externalApiStatus: 'SUCCESS' | 'FAILURE' | 'NONE';
  offlineFallbackUsed: boolean;
  cacheMode: 'NO_CACHE' | 'BACKEND' | 'DUAL';
}

export class CountryService {
  static async fetchRawCountries(): Promise<{ data: Country[]; externalApiStatus: 'SUCCESS' | 'FAILURE'; offlineFallbackUsed: boolean }> {
    const isResearchMode = process.env.RESEARCH_MODE === 'true';
    const fields = 'name,flags,capital,population,area,region,subregion,currencies,languages,cca2,cca3';
    
    researchMetrics.increment('externalApiCalls');

    try {
      const response = await countriesApiClient.get<Country[]>(`/all?fields=${fields}`);
      if (response.data && Array.isArray(response.data) && response.data.length > 50) {
        console.log(`Fetched ${response.data.length} countries from REST Countries API`);
        researchMetrics.increment('externalApiSuccesses');
        return { data: response.data, externalApiStatus: 'SUCCESS', offlineFallbackUsed: false };
      }

      researchMetrics.increment('externalApiFailures');
      if (isResearchMode) {
        logger.error('[RESEARCH_MODE] External REST Countries API returned invalid/empty array. Fallback dataset is disabled.');
        throw new AppError('External REST Countries API returned invalid response in RESEARCH_MODE.', 502, 'EXTERNAL_API_FAILURE');
      }

      logger.warn('External REST Countries response returned empty/small array. Using complete 250-country fallback dataset.');
      return { data: (fallbackDataset as unknown) as Country[], externalApiStatus: 'FAILURE', offlineFallbackUsed: true };
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      researchMetrics.increment('externalApiFailures');
      if (isResearchMode) {
        logger.error('[RESEARCH_MODE] External REST Countries API fetch failed. Fallback dataset is disabled.', error);
        throw new AppError('External REST Countries API request failed in RESEARCH_MODE.', 502, 'EXTERNAL_API_FAILURE');
      }

      logger.warn('Failed to fetch from external REST Countries API. Using complete 250-country fallback dataset.', error);
      return { data: (fallbackDataset as unknown) as Country[], externalApiStatus: 'FAILURE', offlineFallbackUsed: true };
    }
  }

  static async getRawCountriesDataset(forceRefresh = false): Promise<{ data: Country[]; lastUpdated?: string; cacheMeta: CacheMeta }> {
    const isResearchMode = process.env.RESEARCH_MODE === 'true';
    researchMetrics.increment('totalRequests');

    const cacheModeRaw = (process.env.CACHE_MODE || 'DUAL').toUpperCase();
    let cacheMode: 'NO_CACHE' | 'BACKEND' | 'DUAL' = 'DUAL';

    if (cacheModeRaw === 'NO_CACHE' || cacheModeRaw === 'NONE') {
      cacheMode = 'NO_CACHE';
    } else if (cacheModeRaw === 'BACKEND') {
      cacheMode = 'BACKEND';
    } else if (cacheModeRaw === 'DUAL') {
      cacheMode = 'DUAL';
    } else if (isResearchMode) {
      researchMetrics.increment('failedRequests');
      throw new AppError(`Unsupported CACHE_MODE '${process.env.CACHE_MODE}' in RESEARCH_MODE.`, 400, 'INVALID_CACHE_MODE');
    }

    try {
      // 1. NO_CACHE Mode
      if (cacheMode === 'NO_CACHE') {
        if (isResearchMode) {
          logger.info('[RESEARCH_MODE: NO_CACHE] Bypassing backend MongoDB cache layer entirely...');
        }
        const rawResult = await this.fetchRawCountries();
        researchMetrics.increment('successfulRequests');
        return {
          data: rawResult.data,
          lastUpdated: new Date().toISOString(),
          cacheMeta: {
            status: 'DISABLED',
            store: 'NONE',
            externalApiCalled: true,
            externalApiStatus: rawResult.externalApiStatus,
            offlineFallbackUsed: rawResult.offlineFallbackUsed,
            cacheMode,
          },
        };
      }

      // 2. BACKEND / DUAL Mode (Backend Cache Enabled)
      if (!forceRefresh) {
        const cached = await CacheService.get<Country[]>(CACHE_KEY);
        if (cached && 'data' in cached && cached.data && Array.isArray(cached.data) && cached.data.length > 0) {
          researchMetrics.increment('successfulRequests');
          return {
            data: cached.data,
            lastUpdated: cached.lastUpdated,
            cacheMeta: {
              status: 'HIT',
              store: cached.store || 'MONGODB',
              externalApiCalled: false,
              externalApiStatus: 'NONE',
              offlineFallbackUsed: false,
              cacheMode,
            },
          };
        }
      }

      // Backend Cache Miss or Force Refresh
      if (isResearchMode) {
        logger.info('[RESEARCH_MODE: BACKEND/DUAL] Backend MongoDB cache MISS. Invoking REST Countries API...');
      }
      const rawResult = await this.fetchRawCountries();

      // Write to cache if external API fetch succeeded
      if (rawResult.externalApiStatus === 'SUCCESS') {
        const ttlMinutes = parseInt(process.env.CACHE_TTL_MINUTES || '1440', 10);
        await CacheService.set(CACHE_KEY, rawResult.data, ttlMinutes);
      }

      researchMetrics.increment('successfulRequests');
      return {
        data: rawResult.data,
        lastUpdated: new Date().toISOString(),
        cacheMeta: {
          status: 'MISS',
          store: 'NONE',
          externalApiCalled: true,
          externalApiStatus: rawResult.externalApiStatus,
          offlineFallbackUsed: rawResult.offlineFallbackUsed,
          cacheMode,
        },
      };
    } catch (error: unknown) {
      researchMetrics.increment('failedRequests');
      throw error;
    }
  }

  static async getAllCountries(params: CountryQueryParams, forceRefresh = false) {
    const { data: allCountries, lastUpdated, cacheMeta } = await this.getRawCountriesDataset(forceRefresh);

    let filtered = [...allCountries];

    // 1. Search Query
    if (params.search && params.search.trim()) {
      const query = params.search.trim().toLowerCase();
      filtered = filtered.filter((c) => {
        const matchCommon = c.name.common.toLowerCase().includes(query);
        const matchOfficial = c.name.official.toLowerCase().includes(query);
        const matchCapital = c.capital?.some((cap) => cap.toLowerCase().includes(query)) ?? false;
        const matchCca2 = c.cca2?.toLowerCase().includes(query) ?? false;
        const matchCca3 = c.cca3.toLowerCase().includes(query);
        return matchCommon || matchOfficial || matchCapital || matchCca2 || matchCca3;
      });
    }

    // 2. Region Filter
    if (params.region && params.region.trim() && params.region !== 'All') {
      const reg = params.region.trim().toLowerCase();
      filtered = filtered.filter((c) => c.region.toLowerCase() === reg);
    }

    // 3. Min / Max Population Filter
    if (params.minPopulation !== undefined) {
      filtered = filtered.filter((c) => (c.population || 0) >= params.minPopulation!);
    }
    if (params.maxPopulation !== undefined) {
      filtered = filtered.filter((c) => (c.population || 0) <= params.maxPopulation!);
    }

    // 4. Sorting
    if (params.sort) {
      switch (params.sort) {
        case 'name-asc':
          filtered.sort((a, b) => a.name.common.localeCompare(b.name.common));
          break;
        case 'name-desc':
          filtered.sort((a, b) => b.name.common.localeCompare(a.name.common));
          break;
        case 'pop-asc':
          filtered.sort((a, b) => (a.population || 0) - (b.population || 0));
          break;
        case 'pop-desc':
          filtered.sort((a, b) => (b.population || 0) - (a.population || 0));
          break;
        case 'area-asc':
          filtered.sort((a, b) => (a.area || 0) - (b.area || 0));
          break;
        case 'area-desc':
          filtered.sort((a, b) => (b.area || 0) - (a.area || 0));
          break;
      }
    }

    // 5. Pagination
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 12));
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      lastUpdated,
      cacheMeta,
    };
  }

  static async getCountryByCode(code: string): Promise<Country> {
    const { data: allCountries } = await this.getRawCountriesDataset();
    const normalized = code.trim().toUpperCase();

    const country = allCountries.find(
      (c) => c.cca3.toUpperCase() === normalized || (c.cca2 && c.cca2.toUpperCase() === normalized)
    );

    if (!country) {
      throw new AppError(`Country with code '${code}' was not found.`, 404, 'COUNTRY_NOT_FOUND');
    }

    return country;
  }

  static async searchCountries(query: string): Promise<Country[]> {
    if (!query || !query.trim()) {
      throw new AppError('Search query parameter q cannot be empty.', 400, 'EMPTY_QUERY');
    }
    const q = query.trim().toLowerCase();
    const { data: allCountries } = await this.getRawCountriesDataset();

    return allCountries.filter(
      (c) =>
        c.name.common.toLowerCase().includes(q) ||
        c.name.official.toLowerCase().includes(q) ||
        c.cca3.toLowerCase().includes(q) ||
        (c.cca2 && c.cca2.toLowerCase().includes(q))
    );
  }

  static async getAvailableRegions(): Promise<string[]> {
    const { data: allCountries } = await this.getRawCountriesDataset();
    const regions = new Set<string>();

    allCountries.forEach((c) => {
      if (c.region && c.region.trim()) {
        regions.add(c.region.trim());
      }
    });

    return Array.from(regions).sort();
  }

  static async refreshDataset(): Promise<{ lastUpdated: string; totalCountries: number }> {
    await CacheService.invalidate(CACHE_KEY);
    const { data, lastUpdated } = await this.getRawCountriesDataset(true);
    return {
      lastUpdated: lastUpdated || new Date().toISOString(),
      totalCountries: data.length,
    };
  }
}
