import type { Country, CountryChartData, CountryStats, RegionPopulationData } from '../types/country';
import { formatCompactNumber } from './countryUtils';

export const calculateOverallStats = (countries: Country[]): CountryStats => {
  const totalCountries = countries.length;
  const totalPopulation = countries.reduce((acc, c) => acc + (c.population || 0), 0);
  const totalArea = countries.reduce((acc, c) => acc + (c.area || 0), 0);

  const uniqueRegions = new Set(
    countries.map((c) => c.region).filter((r) => r && r.trim().length > 0)
  );

  return {
    totalCountries,
    totalPopulation,
    totalRegions: uniqueRegions.size,
    totalArea,
  };
};

export const getRegionPopulationData = (countries: Country[]): RegionPopulationData[] => {
  const map = new Map<string, { population: number; countryCount: number }>();

  countries.forEach((country) => {
    const reg = country.region || 'Other';
    const existing = map.get(reg) || { population: 0, countryCount: 0 };
    map.set(reg, {
      population: existing.population + (country.population || 0),
      countryCount: existing.countryCount + 1,
    });
  });

  return Array.from(map.entries()).map(([region, data]) => ({
    region,
    population: data.population,
    countryCount: data.countryCount,
  }));
};

export const getTopPopulatedCountries = (countries: Country[], limit = 10): CountryChartData[] => {
  return [...countries]
    .sort((a, b) => b.population - a.population)
    .slice(0, limit)
    .map((c) => ({
      name: c.name.common,
      code: c.cca3,
      value: c.population,
      formattedValue: formatCompactNumber(c.population),
    }));
};

export const getTopAreaCountries = (countries: Country[], limit = 10): CountryChartData[] => {
  return [...countries]
    .sort((a, b) => b.area - a.area)
    .slice(0, limit)
    .map((c) => ({
      name: c.name.common,
      code: c.cca3,
      value: c.area,
      formattedValue: `${formatCompactNumber(c.area)} km²`,
    }));
};
