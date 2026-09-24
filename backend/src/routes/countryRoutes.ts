import { Router } from 'express';
import { CountryController } from '../controllers/countryController';
import { asyncHandler } from '../utils/asyncHandler';
import { validateParams, validateQuery } from '../middleware/validateRequest';
import { countryCodeParamSchema, getCountriesQuerySchema, searchQuerySchema } from '../schemas/countrySchema';
import { refreshRateLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @openapi
 * /api/countries:
 *   get:
 *     summary: Retrieve paginated, filtered, and sorted countries
 *     tags: [Countries]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [name-asc, name-desc, pop-asc, pop-desc, area-asc, area-desc]
 *     responses:
 *       200:
 *         description: Paginated country list
 */
router.get('/', validateQuery(getCountriesQuerySchema), asyncHandler(CountryController.getCountries));

/**
 * @openapi
 * /api/countries/search:
 *   get:
 *     summary: Search countries by common name, official name, or capital
 *     tags: [Countries]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', validateQuery(searchQuerySchema), asyncHandler(CountryController.searchCountries));

/**
 * @openapi
 * /api/countries/regions:
 *   get:
 *     summary: Get dynamic list of available global regions
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: Region strings list
 */
router.get('/regions', asyncHandler(CountryController.getAvailableRegions));

/**
 * @openapi
 * /api/countries/refresh:
 *   post:
 *     summary: Force invalidate local cache and fetch fresh payload from REST Countries API
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: Refreshed dataset metadata
 */
router.post('/refresh', refreshRateLimiter, asyncHandler(CountryController.refreshCountries));

/**
 * @openapi
 * /api/countries/{code}:
 *   get:
 *     summary: Get detailed country information by 2-letter or 3-letter CCA code
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *           example: IND
 *     responses:
 *       200:
 *         description: Detailed country object
 *       404:
 *         description: Country not found
 */
router.get('/:code', validateParams(countryCodeParamSchema), asyncHandler(CountryController.getCountryByCode));

export default router;
