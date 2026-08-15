import app from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB
  await connectDatabase();

  const server = app.listen(PORT, () => {
    logger.info(`APIVerse Backend Server running on port ${PORT}`);
    logger.info(`Swagger API Documentation: http://localhost:${PORT}/api-docs`);
    logger.info(`Health Endpoint: http://localhost:${PORT}/api/health`);
  });

  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down APIVerse backend gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      logger.info('Closed all remaining HTTP connections. Process exiting.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

startServer().catch((err) => {
  logger.error('Failed to start APIVerse backend server:', err);
  process.exit(1);
});
