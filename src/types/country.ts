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
  cca3: string;
}

export type RegionFilter = 'All' | 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania';

export type PopulationFilter = 'any' | 'under10m' | '10m-50m' | '50m-100m' | 'above100m';

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'pop-asc'
  | 'pop-desc'
  | 'area-asc'
  | 'area-desc';

export interface FilterState {
  search: string;
  region: RegionFilter;
  population: PopulationFilter;
  sort: SortOption;
  page: number;
}

export interface CountryStats {
  totalCountries: number;
  totalPopulation: number;
  totalRegions: number;
  totalArea: number;
}

export interface RegionPopulationData {
  region: string;
  population: number;
  countryCount: number;
}

export interface CountryChartData {
  name: string;
  code: string;
  value: number;
  formattedValue: string;
}
