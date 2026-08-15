import { Router } from 'express';
import { FavoriteController } from '../controllers/favoriteController';
import { asyncHandler } from '../utils/asyncHandler';
import { validateBody, validateParams } from '../middleware/validateRequest';
import { createFavoriteSchema, deleteFavoriteParamSchema } from '../schemas/favoriteSchema';

const router = Router();

/**
 * @openapi
 * /api/favorites:
 *   get:
 *     summary: Retrieve user favorited countries
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: Favorited country list
 *   post:
 *     summary: Add country to user favorites
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [countryCode, countryName]
 *             properties:
 *               countryCode:
 *                 type: string
 *                 example: IND
 *               countryName:
 *                 type: string
 *                 example: India
 *     responses:
 *       201:
 *         description: Favorite created
 */
router.get('/', asyncHandler(FavoriteController.getFavorites));
router.post('/', validateBody(createFavoriteSchema), asyncHandler(FavoriteController.addFavorite));

/**
 * @openapi
 * /api/favorites/{countryCode}:
 *   delete:
 *     summary: Remove country from user favorites
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: countryCode
 *         required: true
 *         schema:
 *           type: string
 *           example: IND
 *     responses:
 *       200:
 *         description: Favorite removed
 */
router.delete('/:countryCode', validateParams(deleteFavoriteParamSchema), asyncHandler(FavoriteController.removeFavorite));

export default router;
