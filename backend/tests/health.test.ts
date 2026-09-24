import request from 'supertest';
import app from '../src/app';

describe('GET /api/health', () => {
  it('should return 200 OK with health status payload', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('status', 'healthy');
    expect(res.body.data).toHaveProperty('service', 'APIVerse Backend');
  });
});
