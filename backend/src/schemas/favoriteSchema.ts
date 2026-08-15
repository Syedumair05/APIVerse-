import { z } from 'zod';

export const createFavoriteSchema = z.object({
  countryCode: z
    .string()
    .min(2, 'Country code must be at least 2 characters')
    .max(3, 'Country code must be at most 3 characters')
    .toUpperCase(),
  countryName: z.string().min(1, 'Country name is required'),
});

export const deleteFavoriteParamSchema = z.object({
  countryCode: z
    .string()
    .min(2, 'Country code must be at least 2 characters')
    .max(3, 'Country code must be at most 3 characters')
    .toUpperCase(),
});
