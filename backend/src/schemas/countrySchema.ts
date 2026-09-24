import { z } from 'zod';

export const getCountriesQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 12)),
  search: z.string().optional(),
  region: z.string().optional(),
  minPopulation: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  maxPopulation: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  sort: z.enum(['name-asc', 'name-desc', 'pop-asc', 'pop-desc', 'area-asc', 'area-desc']).optional().default('name-asc'),
});

export const countryCodeParamSchema = z.object({
  code: z.string().min(2, 'Country code must be at least 2 characters').max(3, 'Country code cannot exceed 3 characters'),
});

export const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search query cannot be empty'),
});

export const analyticsLimitSchema = z.object({
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
});
