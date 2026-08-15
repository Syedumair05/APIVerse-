import axios from 'axios';
import type { Country } from '../types/country';

const BACKEND_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const DIRECT_REST_API_URL = 'https://restcountries.com/v3.1';
const CACHE_KEY = 'apiverse_countries_cache';
const CACHE_TIMESTAMP_KEY = 'apiverse_countries_cache_timestamp';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const apiClient = axios.create({
  timeout: 12000, // 12 second timeout
  headers: {
    'Accept': 'application/json',
  },
});

export const fetchCountriesFromBackend = async (): Promise<Country[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: Country[] }>(`${BACKEND_API_URL}/countries?limit=300`);
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    throw new Error('Invalid backend response structure');
  } catch {
    // Fallback to direct REST Countries endpoint if backend service is unreachable
    const fields = 'name,flags,capital,population,area,region,subregion,currencies,languages,cca2,cca3';
    const fallbackResponse = await apiClient.get<Country[]>(`${DIRECT_REST_API_URL}/all?fields=${fields}`);
    if (!fallbackResponse.data || !Array.isArray(fallbackResponse.data)) {
      throw new Error('Received invalid country data format from server.');
    }
    return fallbackResponse.data;
  }
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

  // Fetch fresh data from APIVerse Backend (with direct REST API fallback)
  try {
    const freshData = await fetchCountriesFromBackend();
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch {
      // Silently handle quota exceeded or private mode errors
    }
    return { data: freshData, fromCache: false };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Connection timed out. Please check your internet connection and try again.');
      }
      if (!error.response) {
        throw new Error('Network error. Unable to connect to APIVerse backend or REST API.');
      }
      if (error.response.status >= 500) {
        throw new Error('Backend service is currently unavailable. Please try again later.');
      }
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching country data.');
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
