import type { Country, PopulationFilter, RegionFilter, SortOption } from '../types/country';

export const formatNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null || isNaN(num)) return 'N/A';
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatCompactNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null || isNaN(num)) return 'N/A';
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const calculateDensity = (population: number, area: number): string => {
  if (!area || area <= 0) return 'N/A';
  const density = population / area;
  return `${formatNumber(Math.round(density * 10) / 10)} / km²`;
};

export const getPopulationRank = (countryCca3: string, allCountries: Country[]): number => {
  const sorted = [...allCountries].sort((a, b) => b.population - a.population);
  const index = sorted.findIndex((c) => c.cca3 === countryCca3);
  return index !== -1 ? index + 1 : 0;
};

export const formatCurrencies = (currencies?: Country['currencies']): string => {
  if (!currencies || Object.keys(currencies).length === 0) return 'N/A';
  return Object.values(currencies)
    .map((c) => (c.symbol ? `${c.name} (${c.symbol})` : c.name))
    .join(', ');
};

export const formatLanguages = (languages?: Country['languages']): string => {
  if (!languages || Object.keys(languages).length === 0) return 'N/A';
  return Object.values(languages).join(', ');
};

export const filterCountries = (
  countries: Country[],
  search: string,
  region: RegionFilter,
  population: PopulationFilter
): Country[] => {
  const trimmedSearch = search.trim().toLowerCase();

  return countries.filter((country) => {
    // 1. Search matching (common name, official name, capital)
    if (trimmedSearch) {
      const matchCommon = country.name.common.toLowerCase().includes(trimmedSearch);
      const matchOfficial = country.name.official.toLowerCase().includes(trimmedSearch);
      const matchCapital = country.capital?.some((cap) => cap.toLowerCase().includes(trimmedSearch)) ?? false;
      const matchCode = country.cca3.toLowerCase().includes(trimmedSearch);

      if (!matchCommon && !matchOfficial && !matchCapital && !matchCode) {
        return false;
      }
    }

    // 2. Region filter
    if (region !== 'All') {
      if (country.region.toLowerCase() !== region.toLowerCase()) {
        return false;
      }
    }

    // 3. Population bracket filter
    if (population !== 'any') {
      const pop = country.population;
      switch (population) {
        case 'under10m':
          if (pop >= 10_000_000) return false;
          break;
        case '10m-50m':
          if (pop < 10_000_000 || pop > 50_000_000) return false;
          break;
        case '50m-100m':
          if (pop < 50_000_000 || pop > 100_000_000) return false;
          break;
        case 'above100m':
          if (pop <= 100_000_000) return false;
          break;
      }
    }

    return true;
  });
};

export const sortCountries = (countries: Country[], sort: SortOption): Country[] => {
  const sorted = [...countries];
  switch (sort) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.common.localeCompare(b.name.common));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.common.localeCompare(a.name.common));
    case 'pop-asc':
      return sorted.sort((a, b) => a.population - b.population);
    case 'pop-desc':
      return sorted.sort((a, b) => b.population - a.population);
    case 'area-asc':
      return sorted.sort((a, b) => a.area - b.area);
    case 'area-desc':
      return sorted.sort((a, b) => b.area - a.area);
    default:
      return sorted;
  }
};
