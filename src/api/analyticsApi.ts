import axios from 'axios';
import type { Analytics, RegionAnalyticsData } from '../types/analytics';
import type { Country } from '../types/country';
import { fetchCountriesPayload } from './countriesApi';

const apiClient = axios.create({
  timeout: 8000,
  headers: {
    'Accept': 'application/json',
  },
});

export const calculateGlobalAnalytics = (countries: Country[]): Analytics => {
  const totalCountries = countries.length;
  const totalPopulation = countries.reduce((sum, c) => sum + (c.population || 0), 0);
  const totalArea = countries.reduce((sum, c) => sum + (c.area || 0), 0);
  const regionsSet = new Set(countries.map((c) => c.region).filter(Boolean));
  const numberOfRegions = regionsSet.size;
  const averagePopulation = totalCountries > 0 ? Math.round(totalPopulation / totalCountries) : 0;

  const sortedByArea = [...countries].sort((a, b) => (b.area || 0) - (a.area || 0));
  const sortedByPop = [...countries].sort((a, b) => (b.population || 0) - (a.population || 0));

  return {
    totalCountries,
    totalPopulation,
    totalArea,
    numberOfRegions,
    averagePopulation,
    largestCountryByArea: sortedByArea[0],
    mostPopulousCountry: sortedByPop[0],
  };
};

export const getOverviewAnalytics = async (): Promise<Analytics> => {
  const customBackendUrl = import.meta.env.VITE_API_URL;
  const isProductionHost =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  if (customBackendUrl && (!isProductionHost || !customBackendUrl.includes('localhost'))) {
    try {
      const response = await apiClient.get<{ success: boolean; data: Analytics }>(
        `${customBackendUrl}/analytics/overview`
      );
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Fall back to client calculation over full complete dataset
    }
  }

  const allCountries = await fetchCountriesPayload();
  return calculateGlobalAnalytics(allCountries);
};

export const getRegionAnalytics = async (): Promise<RegionAnalyticsData[]> => {
  const allCountries = await fetchCountriesPayload();
  const regionMap = new Map<string, { countries: number; population: number; area: number }>();

  allCountries.forEach((c) => {
    const reg = c.region || 'Unknown';
    const current = regionMap.get(reg) || { countries: 0, population: 0, area: 0 };
    regionMap.set(reg, {
      countries: current.countries + 1,
      population: current.population + (c.population || 0),
      area: current.area + (c.area || 0),
    });
  });

  return Array.from(regionMap.entries()).map(([region, data]) => ({
    region,
    ...data,
  }));
};

export const getTopPopulationCountries = async (limit = 10): Promise<Country[]> => {
  const allCountries = await fetchCountriesPayload();
  return [...allCountries].sort((a, b) => (b.population || 0) - (a.population || 0)).slice(0, limit);
};

export const getTopAreaCountries = async (limit = 10): Promise<Country[]> => {
  const allCountries = await fetchCountriesPayload();
  return [...allCountries].sort((a, b) => (b.area || 0) - (a.area || 0)).slice(0, limit);
};
