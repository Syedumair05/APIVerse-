import axios from 'axios';
import type { Country } from '../types/country';
import fallbackCountries from '../data/countriesData.json';

const DIRECT_REST_API_URL = 'https://restcountries.com/v3.1';
const CACHE_KEY = 'apiverse_countries_cache';
const CACHE_TIMESTAMP_KEY = 'apiverse_countries_cache_timestamp';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

declare global {
  interface Window {
    __APIVERSE_RESEARCH_METRICS__?: {
      clientCacheHits: number;
      clientCacheMisses: number;
      clientCacheWrites: number;
      clientRequests: number;
    };
  }
}

const getBrowserMetrics = () => {
  if (typeof window !== 'undefined') {
    if (!window.__APIVERSE_RESEARCH_METRICS__) {
      window.__APIVERSE_RESEARCH_METRICS__ = {
        clientCacheHits: 0,
        clientCacheMisses: 0,
        clientCacheWrites: 0,
        clientRequests: 0,
      };
    }
    return window.__APIVERSE_RESEARCH_METRICS__;
  }
  return null;
};

const apiClient = axios.create({
  timeout: 5000, // 5 second timeout for fast fallback
  headers: {
    'Accept': 'application/json',
  },
});

export const getCacheMode = (): 'NO_CACHE' | 'BACKEND' | 'DUAL' => {
  const mode = (import.meta.env.VITE_CACHE_MODE || 'DUAL').toUpperCase();
  if (mode === 'NO_CACHE' || mode === 'NONE') return 'NO_CACHE';
  if (mode === 'BACKEND') return 'BACKEND';
  return 'DUAL';
};

export const fetchCountriesPayload = async (): Promise<Country[]> => {
  const customBackendUrl = import.meta.env.VITE_API_URL;
  const isResearchMode = import.meta.env.VITE_RESEARCH_MODE === 'true';
  const isProductionHost = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

  // If custom backend URL is configured (or default backend in research mode)
  if (customBackendUrl && (!isProductionHost || !customBackendUrl.includes('localhost'))) {
    try {
      const endpoint = isResearchMode
        ? `${customBackendUrl}/countries?page=1&limit=12`
        : `${customBackendUrl}/countries?limit=300`;
      const response = await apiClient.get<{ success: boolean; data: Country[] }>(endpoint);
      if (response.data && response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data;
      }
    } catch (err) {
      if (isResearchMode) {
        console.error('[RESEARCH_MODE] APIVerse Backend request failed during benchmark execution.', err);
        throw new Error('BACKEND_REQUEST_FAILURE');
      }
      // Proceed to direct REST Countries API or fallback in normal mode
    }
  }

  if (isResearchMode) {
    console.error('[RESEARCH_MODE] Backend URL missing or backend unavailable. Suppressing direct fallback for benchmark validity.');
    throw new Error('BACKEND_REQUEST_FAILURE');
  }

  // Direct fetch attempt from REST Countries API (Normal Application Mode)
  try {
    const fields = 'name,flags,capital,population,area,region,subregion,currencies,languages,cca2,cca3';
    const directResponse = await apiClient.get<Country[]>(`${DIRECT_REST_API_URL}/all?fields=${fields}`);
    
    if (directResponse.data && Array.isArray(directResponse.data) && directResponse.data.length > 0) {
      return directResponse.data;
    }
  } catch {
    // Silently proceed to built-in fallback dataset
  }

  // Guaranteed offline/deprecation fallback dataset
  return (fallbackCountries as unknown) as Country[];
};

export const getCountries = async (forceRefresh = false): Promise<{ data: Country[]; fromCache: boolean }> => {
  const cacheMode = getCacheMode();
  const isClientCacheEnabled = cacheMode === 'DUAL';
  const isResearchMode = import.meta.env.VITE_RESEARCH_MODE === 'true';
  const metrics = getBrowserMetrics();

  if (metrics) {
    metrics.clientRequests++;
  }

  if (isClientCacheEnabled && !forceRefresh) {
    try {
      const cachedRaw = localStorage.getItem(CACHE_KEY);
      const cachedTimestampRaw = localStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (cachedRaw && cachedTimestampRaw) {
        const timestamp = parseInt(cachedTimestampRaw, 10);
        const now = Date.now();

        if (now - timestamp < CACHE_TTL_MS) {
          const parsedData = JSON.parse(cachedRaw) as Country[];
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            if (metrics) {
              metrics.clientCacheHits++;
            }
            return { data: parsedData, fromCache: true };
          }
        }
      }
    } catch {
      // In case of localStorage parsing issues, proceed to live fetch
    }
  }

  if (metrics) {
    metrics.clientCacheMisses++;
  }

  try {
    const freshData = await fetchCountriesPayload();

    if (isClientCacheEnabled) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        if (metrics) {
          metrics.clientCacheWrites++;
        }
      } catch {
        // Silently handle quota exceeded or private mode errors
      }
    }

    return { data: freshData, fromCache: false };
  } catch (err) {
    if (isResearchMode) {
      throw err;
    }
    return { data: (fallbackCountries as unknown) as Country[], fromCache: false };
  }
};

export const clearCountriesCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  } catch {
    // Ignore error
  }

  const metrics = getBrowserMetrics();
  if (metrics) {
    metrics.clientCacheHits = 0;
    metrics.clientCacheMisses = 0;
    metrics.clientCacheWrites = 0;
    metrics.clientRequests = 0;
  }
};
