import axios from 'axios';
import { Country, CountryQueryParams } from '../types/country';
import { CacheService } from './cacheService';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const COUNTRIES_API_URL = process.env.COUNTRIES_API_URL || 'https://restcountries.com/v3.1';
const CACHE_KEY = 'countries_all_data';

const MOCK_FALLBACK_COUNTRIES: Country[] = [
  {
    name: { common: 'India', official: 'Republic of India' },
    flags: { png: 'https://flagcdn.com/w320/in.png', svg: 'https://flagcdn.com/in.svg' },
    capital: ['New Delhi'],
    population: 1408044253,
    area: 3287263,
    region: 'Asia',
    subregion: 'Southern Asia',
    currencies: { INR: { name: 'Indian Rupee', symbol: '₹' } },
    languages: { hin: 'Hindi', eng: 'English' },
    cca2: 'IN',
    cca3: 'IND',
  },
  {
    name: { common: 'United States', official: 'United States of America' },
    flags: { png: 'https://flagcdn.com/w320/us.png', svg: 'https://flagcdn.com/us.svg' },
    capital: ['Washington, D.C.'],
    population: 331893745,
    area: 9372610,
    region: 'Americas',
    subregion: 'North America',
    currencies: { USD: { name: 'United States Dollar', symbol: '$' } },
    languages: { eng: 'English' },
    cca2: 'US',
    cca3: 'USA',
  },
  {
    name: { common: 'Japan', official: 'Japan' },
    flags: { png: 'https://flagcdn.com/w320/jp.png', svg: 'https://flagcdn.com/jp.svg' },
    capital: ['Tokyo'],
    population: 125836021,
    area: 377930,
    region: 'Asia',
    subregion: 'Eastern Asia',
    currencies: { JPY: { name: 'Japanese Yen', symbol: '¥' } },
    languages: { jpn: 'Japanese' },
    cca2: 'JP',
    cca3: 'JPN',
  },
  {
    name: { common: 'Brazil', official: 'Federative Republic of Brazil' },
    flags: { png: 'https://flagcdn.com/w320/br.png', svg: 'https://flagcdn.com/br.svg' },
    capital: ['Brasília'],
    population: 213993437,
    area: 8515767,
    region: 'Americas',
    subregion: 'South America',
    currencies: { BRL: { name: 'Brazilian Real', symbol: 'R$' } },
    languages: { por: 'Portuguese' },
    cca2: 'BR',
    cca3: 'BRA',
  },
  {
    name: { common: 'France', official: 'French Republic' },
    flags: { png: 'https://flagcdn.com/w320/fr.png', svg: 'https://flagcdn.com/fr.svg' },
    capital: ['Paris'],
    population: 67391582,
    area: 551695,
    region: 'Europe',
    subregion: 'Western Europe',
    currencies: { EUR: { name: 'Euro', symbol: '€' } },
    languages: { fra: 'French' },
    cca2: 'FR',
    cca3: 'FRA',
  },
  {
    name: { common: 'Australia', official: 'Commonwealth of Australia' },
    flags: { png: 'https://flagcdn.com/w320/au.png', svg: 'https://flagcdn.com/au.svg' },
    capital: ['Canberra'],
    population: 25687041,
    area: 7692024,
    region: 'Oceania',
    subregion: 'Australia and New Zealand',
    currencies: { AUD: { name: 'Australian Dollar', symbol: '$' } },
    languages: { eng: 'English' },
    cca2: 'AU',
    cca3: 'AUS',
  },
];

export const countriesApiClient = axios.create({
  baseURL: COUNTRIES_API_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'APIVerse-Backend/1.0',
  },
});

export class CountryService {
  static async fetchRawCountries(): Promise<Country[]> {
    const fields = 'name,flags,capital,population,area,region,subregion,currencies,languages,cca2,cca3';
    try {
      const response = await countriesApiClient.get<Country[]>(`/all?fields=${fields}`);
      if (!response.data || !Array.isArray(response.data)) {
        throw new AppError('Received invalid data format from external REST Countries API.', 502, 'BAD_GATEWAY');
      }
      return response.data;
    } catch (error: unknown) {
      logger.warn('Failed to fetch from REST Countries API. Using fallback mock dataset.', error);
      return MOCK_FALLBACK_COUNTRIES;
    }
  }

  static async getRawCountriesDataset(forceRefresh = false): Promise<{ data: Country[]; lastUpdated?: string }> {
    if (!forceRefresh) {
      const cached = await CacheService.get<Country[]>(CACHE_KEY);
      if (cached && Array.isArray(cached.data) && cached.data.length > 0) {
        return { data: cached.data, lastUpdated: cached.lastUpdated };
      }
    }

    logger.info('Fetching fresh country payload from REST Countries API...');
    const freshData = await this.fetchRawCountries();
    const ttlMinutes = parseInt(process.env.CACHE_TTL_MINUTES || '1440', 10);
    await CacheService.set(CACHE_KEY, freshData, ttlMinutes);
    return { data: freshData, lastUpdated: new Date().toISOString() };
  }

  static async getAllCountries(params: CountryQueryParams, forceRefresh = false) {
    const { data: allCountries, lastUpdated } = await this.getRawCountriesDataset(forceRefresh);

    let filtered = [...allCountries];

    // 1. Search Query
    if (params.search && params.search.trim()) {
      const query = params.search.trim().toLowerCase();
      filtered = filtered.filter((c) => {
        const matchCommon = c.name.common.toLowerCase().includes(query);
        const matchOfficial = c.name.official.toLowerCase().includes(query);
        const matchCapital = c.capital?.some((cap) => cap.toLowerCase().includes(query)) ?? false;
        const matchCca2 = c.cca2?.toLowerCase().includes(query) ?? false;
        const matchCca3 = c.cca3.toLowerCase().includes(query);
        return matchCommon || matchOfficial || matchCapital || matchCca2 || matchCca3;
      });
    }

    // 2. Region Filter
    if (params.region && params.region.trim() && params.region !== 'All') {
      const reg = params.region.trim().toLowerCase();
      filtered = filtered.filter((c) => c.region.toLowerCase() === reg);
    }

    // 3. Min / Max Population Filter
    if (params.minPopulation !== undefined) {
      filtered = filtered.filter((c) => c.population >= params.minPopulation!);
    }
    if (params.maxPopulation !== undefined) {
      filtered = filtered.filter((c) => c.population <= params.maxPopulation!);
    }

    // 4. Sorting
    if (params.sort) {
      switch (params.sort) {
        case 'name-asc':
          filtered.sort((a, b) => a.name.common.localeCompare(b.name.common));
          break;
        case 'name-desc':
          filtered.sort((a, b) => b.name.common.localeCompare(a.name.common));
          break;
        case 'pop-asc':
          filtered.sort((a, b) => a.population - b.population);
          break;
        case 'pop-desc':
          filtered.sort((a, b) => b.population - a.population);
          break;
        case 'area-asc':
          filtered.sort((a, b) => a.area - b.area);
          break;
        case 'area-desc':
          filtered.sort((a, b) => b.area - a.area);
          break;
      }
    }

    // 5. Pagination
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 12));
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      lastUpdated,
    };
  }

  static async getCountryByCode(code: string): Promise<Country> {
    const { data: allCountries } = await this.getRawCountriesDataset();
    const normalized = code.trim().toUpperCase();

    const country = allCountries.find(
      (c) => c.cca3.toUpperCase() === normalized || (c.cca2 && c.cca2.toUpperCase() === normalized)
    );

    if (!country) {
      throw new AppError(`Country with code '${code}' was not found.`, 404, 'COUNTRY_NOT_FOUND');
    }

    return country;
  }

  static async searchCountries(query: string): Promise<Country[]> {
    if (!query || !query.trim()) {
      throw new AppError('Search query parameter q cannot be empty.', 400, 'EMPTY_QUERY');
    }
    const q = query.trim().toLowerCase();
    const { data: allCountries } = await this.getRawCountriesDataset();

    return allCountries.filter(
      (c) =>
        c.name.common.toLowerCase().includes(q) ||
        c.name.official.toLowerCase().includes(q) ||
        c.cca3.toLowerCase().includes(q) ||
        (c.cca2 && c.cca2.toLowerCase().includes(q))
    );
  }

  static async getAvailableRegions(): Promise<string[]> {
    const { data: allCountries } = await this.getRawCountriesDataset();
    const regions = new Set<string>();

    allCountries.forEach((c) => {
      if (c.region && c.region.trim()) {
        regions.add(c.region.trim());
      }
    });

    return Array.from(regions).sort();
  }

  static async refreshDataset(): Promise<{ lastUpdated: string; totalCountries: number }> {
    await CacheService.invalidate(CACHE_KEY);
    const { data, lastUpdated } = await this.getRawCountriesDataset(true);
    return {
      lastUpdated: lastUpdated || new Date().toISOString(),
      totalCountries: data.length,
    };
  }
}
