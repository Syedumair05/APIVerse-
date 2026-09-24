import request from 'supertest';
import app from '../src/app';
import { researchMetrics } from '../src/services/researchService';
import { getRateLimitMax } from '../src/middleware/rateLimiter';

describe('Research Experiment API & Controls', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Rate Limiter Configurations', () => {
    it('should return default 100 max requests in normal mode', () => {
      delete process.env.RESEARCH_MODE;
      expect(getRateLimitMax()).toBe(100);
    });

    it('should return RESEARCH_RATE_LIMIT (default 10000) when RESEARCH_MODE=true', () => {
      process.env.RESEARCH_MODE = 'true';
      expect(getRateLimitMax()).toBe(10000);

      process.env.RESEARCH_RATE_LIMIT = '50000';
      expect(getRateLimitMax()).toBe(50000);
    });
  });

  describe('GET /api/research/stats', () => {
    it('should return 403 Forbidden when RESEARCH_MODE is not active', async () => {
      delete process.env.RESEARCH_MODE;
      const res = await request(app).get('/api/research/stats');
      expect(res.status).toBe(403);
    });

    it('should return 200 OK with experiment counters when RESEARCH_MODE=true', async () => {
      process.env.RESEARCH_MODE = 'true';
      process.env.CACHE_MODE = 'BACKEND';
      researchMetrics.resetStats();

      const res = await request(app).get('/api/research/stats');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('cacheMode', 'BACKEND');
      expect(res.body.data).toHaveProperty('totalRequests');
      expect(res.body.data).toHaveProperty('backendCacheHits');
      expect(res.body.data).toHaveProperty('backendCacheMisses');
      expect(res.body.data).toHaveProperty('externalApiCalls');
    });
  });

  describe('POST /api/research/clear-cache', () => {
    it('should clear research cache and reset counters in RESEARCH_MODE', async () => {
      process.env.RESEARCH_MODE = 'true';
      process.env.NODE_ENV = 'development';
      
      const res = await request(app).post('/api/research/clear-cache');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      const statsRes = await request(app).get('/api/research/stats');
      expect(statsRes.body.data.totalRequests).toBe(0);
      expect(statsRes.body.data.backendCacheHits).toBe(0);
    });
  });

  describe('Deterministic Benchmark Endpoint Request Shape', () => {
    it('should handle /api/countries?page=1&limit=12 with research mode error handling when external API fails', async () => {
      process.env.RESEARCH_MODE = 'true';
      process.env.CACHE_MODE = 'NO_CACHE';

      const res = await request(app).get('/api/countries?page=1&limit=12');
      // In offline/mocked environments, external API failure returns 502 (disabling offline fallback), or 200 if online
      expect([200, 502]).toContain(res.status);
      if (res.status === 502) {
        expect(res.body.error).toHaveProperty('code', 'EXTERNAL_API_FAILURE');
      }
    });
  });
});
