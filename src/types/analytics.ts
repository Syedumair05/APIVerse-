import type { Country } from './country';

export interface Analytics {
  totalCountries: number;
  totalPopulation: number;
  totalArea: number;
  numberOfRegions: number;
  averagePopulation: number;
  largestCountryByArea?: Country;
  mostPopulousCountry?: Country;
}

export interface RegionAnalyticsData {
  region: string;
  countries: number;
  population: number;
  area: number;
}
