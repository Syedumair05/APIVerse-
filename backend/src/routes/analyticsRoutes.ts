import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { asyncHandler } from '../utils/asyncHandler';
import { validateQuery } from '../middleware/validateRequest';
import { analyticsLimitSchema } from '../schemas/countrySchema';

const router = Router();

/**
 * @openapi
 * /api/analytics/overview:
 *   get:
 *     summary: Overall country analytics (total population, area, average, top nations)
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Overview analytics data
 */
router.get('/overview', asyncHandler(AnalyticsController.getOverview));

/**
 * @openapi
 * /api/analytics/regions:
 *   get:
 *     summary: Aggregated regional analytics for chart visualizations
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Regional analytics data
 */
router.get('/regions', asyncHandler(AnalyticsController.getRegionAnalytics));

/**
 * @openapi
 * /api/analytics/top-population:
 *   get:
 *     summary: Top most populous countries
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Top populated countries list
 */
router.get('/top-population', validateQuery(analyticsLimitSchema), asyncHandler(AnalyticsController.getTopPopulation));

/**
 * @openapi
 * /api/analytics/top-area:
 *   get:
 *     summary: Top largest countries by surface area
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Top area countries list
 */
router.get('/top-area', validateQuery(analyticsLimitSchema), asyncHandler(AnalyticsController.getTopArea));

export default router;
