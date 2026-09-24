import request from 'supertest';
import app from '../src/app';

describe('Analytics Endpoints', () => {
  it('GET /api/analytics/overview should return overview KPI metrics', async () => {
    const res = await request(app).get('/api/analytics/overview');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('totalCountries');
    expect(res.body.data).toHaveProperty('totalPopulation');
    expect(res.body.data).toHaveProperty('totalArea');
  }, 15000);

  it('GET /api/analytics/regions should return regional metrics array', async () => {
    const res = await request(app).get('/api/analytics/regions');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  }, 15000);

  it('GET /api/analytics/top-population?limit=5 should return top 5 populated nations', async () => {
    const res = await request(app).get('/api/analytics/top-population?limit=5');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(5);
  }, 15000);

  it('GET /api/analytics/top-area?limit=5 should return top 5 largest area nations', async () => {
    const res = await request(app).get('/api/analytics/top-area?limit=5');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(5);
  }, 15000);
});
