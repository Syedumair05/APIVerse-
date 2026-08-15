import axios from 'axios';
import type { Country } from '../types/country';
import fallbackCountries from '../data/countriesData.json';

const DIRECT_REST_API_URL = 'https://restcountries.com/v3.1';
const CACHE_KEY = 'apiverse_countries_cache';
const CACHE_TIMESTAMP_KEY = 'apiverse_countries_cache_timestamp';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const apiClient = axios.create({
  timeout: 5000, // 5 second timeout for fast fallback
  headers: {
    'Accept': 'application/json',
  },
});

export const fetchCountriesPayload = async (): Promise<Country[]> => {
  const customBackendUrl = import.meta.env.VITE_API_URL;
  const isProductionHost = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

  // If custom backend URL is configured (and not pointing to localhost on production host)
  if (customBackendUrl && (!isProductionHost || !customBackendUrl.includes('localhost'))) {
    try {
      const response = await apiClient.get<{ success: boolean; data: Country[] }>(`${customBackendUrl}/countries?limit=300`);
      if (response.data && response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data;
      }
    } catch {
      // Proceed to direct REST Countries API or fallback
    }
  }

  // Direct fetch attempt from REST Countries API
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
  if (!forceRefresh) {
    try {
      const cachedRaw = localStorage.getItem(CACHE_KEY);
      const cachedTimestampRaw = localStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (cachedRaw && cachedTimestampRaw) {
        const timestamp = parseInt(cachedTimestampRaw, 10);
        const now = Date.now();

        if (now - timestamp < CACHE_TTL_MS) {
          const parsedData = JSON.parse(cachedRaw) as Country[];
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            return { data: parsedData, fromCache: true };
          }
        }
      }
    } catch {
      // In case of localStorage parsing issues, proceed to live fetch
    }
  }

  try {
    const freshData = await fetchCountriesPayload();
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch {
      // Silently handle quota exceeded or private mode errors
    }
    return { data: freshData, fromCache: false };
  } catch {
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
};
