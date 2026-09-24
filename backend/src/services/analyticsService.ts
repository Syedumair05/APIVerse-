import { CountryService } from './countryService';
import { OverviewAnalytics, RegionAnalytics } from '../types/country';

export class AnalyticsService {
  static async getOverviewAnalytics(): Promise<OverviewAnalytics & { numberOfRegions: number }> {
    const { data: countries } = await CountryService.getRawCountriesDataset();

    const totalCountries = countries.length;
    const totalPopulation = countries.reduce((sum, c) => sum + (c.population || 0), 0);
    const totalArea = countries.reduce((sum, c) => sum + (c.area || 0), 0);
    
    const uniqueRegions = new Set(countries.map((c) => c.region).filter((r) => r && r.trim()));
    const averagePopulation = totalCountries > 0 ? Math.round(totalPopulation / totalCountries) : 0;

    let largestCountry: OverviewAnalytics['largestCountry'] = null;
    let mostPopulousCountry: OverviewAnalytics['mostPopulousCountry'] = null;

    if (countries.length > 0) {
      const sortedByArea = [...countries].sort((a, b) => (b.area || 0) - (a.area || 0));
      const sortedByPop = [...countries].sort((a, b) => (b.population || 0) - (a.population || 0));

      largestCountry = {
        name: sortedByArea[0].name.common,
        cca3: sortedByArea[0].cca3,
        area: sortedByArea[0].area || 0,
      };

      mostPopulousCountry = {
        name: sortedByPop[0].name.common,
        cca3: sortedByPop[0].cca3,
        population: sortedByPop[0].population || 0,
      };
    }

    return {
      totalCountries,
      totalPopulation,
      totalArea,
      totalRegions: uniqueRegions.size,
      numberOfRegions: uniqueRegions.size,
      averagePopulation,
      largestCountry,
      mostPopulousCountry,
    };
  }

  static async getRegionAnalytics(): Promise<RegionAnalytics[]> {
    const { data: countries } = await CountryService.getRawCountriesDataset();
    const map = new Map<string, { countries: number; population: number; area: number }>();

    countries.forEach((country) => {
      const reg = country.region || 'Other';
      const current = map.get(reg) || { countries: 0, population: 0, area: 0 };
      map.set(reg, {
        countries: current.countries + 1,
        population: current.population + (country.population || 0),
        area: current.area + (country.area || 0),
      });
    });

    return Array.from(map.entries()).map(([region, stats]) => ({
      region,
      countries: stats.countries,
      population: stats.population,
      area: stats.area,
    }));
  }

  static async getTopPopulatedCountries(limit = 10) {
    const safeLimit = Math.min(50, Math.max(1, limit));
    const { data: countries } = await CountryService.getRawCountriesDataset();

    return [...countries]
      .sort((a, b) => (b.population || 0) - (a.population || 0))
      .slice(0, safeLimit)
      .map((c) => ({
        name: c.name.common,
        cca3: c.cca3,
        population: c.population || 0,
        region: c.region,
        flag: c.flags.svg || c.flags.png,
      }));
  }

  static async getTopAreaCountries(limit = 10) {
    const safeLimit = Math.min(50, Math.max(1, limit));
    const { data: countries } = await CountryService.getRawCountriesDataset();

    return [...countries]
      .sort((a, b) => (b.area || 0) - (a.area || 0))
      .slice(0, safeLimit)
      .map((c) => ({
        name: c.name.common,
        cca3: c.cca3,
        area: c.area || 0,
        region: c.region,
        flag: c.flags.svg || c.flags.png,
      }));
  }
}
