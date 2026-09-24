export interface CountryName {
  common: string;
  official: string;
  nativeName?: Record<string, { official: string; common: string }>;
}

export interface CountryFlags {
  png: string;
  svg: string;
  alt?: string;
}

export interface Currency {
  name: string;
  symbol?: string;
}

export interface Country {
  name: CountryName;
  flags: CountryFlags;
  capital?: string[];
  population: number;
  area: number;
  region: string;
  subregion?: string;
  currencies?: Record<string, Currency>;
  languages?: Record<string, string>;
  cca2?: string;
  cca3: string;
}

export type RegionFilter = 'All' | 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania';
export type SortOption = 'name-asc' | 'name-desc' | 'pop-asc' | 'pop-desc' | 'area-asc' | 'area-desc';

export interface CountryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  region?: string;
  minPopulation?: number;
  maxPopulation?: number;
  sort?: SortOption;
}

export interface OverviewAnalytics {
  totalCountries: number;
  totalPopulation: number;
  totalArea: number;
  totalRegions: number;
  averagePopulation: number;
  largestCountry: {
    name: string;
    cca3: string;
    area: number;
  } | null;
  mostPopulousCountry: {
    name: string;
    cca3: string;
    population: number;
  } | null;
}

export interface RegionAnalytics {
  region: string;
  countries: number;
  population: number;
  area: number;
}
