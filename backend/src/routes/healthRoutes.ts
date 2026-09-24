import { Router } from 'express';
import { HealthController } from '../controllers/healthController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health Check & System Status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System status payload
 */
router.get('/', asyncHandler(HealthController.getHealthStatus));

export default router;
