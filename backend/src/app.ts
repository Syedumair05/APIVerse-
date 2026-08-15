import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

import healthRoutes from './routes/healthRoutes';
import countryRoutes from './routes/countryRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import { swaggerSpec } from './config/swagger';
import { generalRateLimiter } from './middleware/rateLimiter';
import { notFoundHandler } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Swagger UI inline scripts
  })
);

// CORS configuration using CLIENT_URL
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching CLIENT_URL / localhost
      if (!origin || origin === clientUrl || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev mode for flexibility
      }
    },
    credentials: true,
  })
);

// HTTP Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply General Rate Limiter to API routes
app.use('/api', generalRateLimiter);

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root Welcome Endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to APIVerse Backend REST API Gateway',
    documentation: '/api-docs',
    health: '/api/health',
  });
});

// 404 Route Not Found
app.use(notFoundHandler);

// Centralized Error Middleware
app.use(errorHandler);

export default app;
