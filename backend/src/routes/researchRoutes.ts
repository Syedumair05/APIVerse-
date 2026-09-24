import { Router } from 'express';
import { ResearchController } from '../controllers/researchController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/**
 * @openapi
 * /api/research/stats:
 *   get:
 *     summary: Retrieve research experiment metrics and counter statistics
 *     tags: [Research]
 *     responses:
 *       200:
 *         description: Current research metrics payload
 */
router.get('/stats', asyncHandler(ResearchController.getStats));

/**
 * @openapi
 * /api/research/clear-cache:
 *   post:
 *     summary: Protected research tool to clear MongoDB backend cache and reset counters
 *     tags: [Research]
 *     responses:
 *       200:
 *         description: Cache clear operation result
 */
router.post('/clear-cache', asyncHandler(ResearchController.clearCache));

export default router;
