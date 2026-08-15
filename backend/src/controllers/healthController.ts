import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { getDbStatus } from '../config/database';

export class HealthController {
  static getHealthStatus = async (_req: Request, res: Response) => {
    const dbStatus = getDbStatus();
    const isHealthy = true; // Service is running

    return ApiResponse.success(
      res,
      {
        status: isHealthy ? 'healthy' : 'degraded',
        service: 'APIVerse Backend',
        timestamp: new Date().toISOString(),
        database: {
          connected: dbStatus.connected,
          host: dbStatus.host || 'N/A',
          name: dbStatus.name || 'N/A',
        },
        uptimeSeconds: Math.floor(process.uptime()),
      },
      'Backend service health status'
    );
  };
}
