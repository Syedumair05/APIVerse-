import request from 'supertest';
import app from '../src/app';

describe('Country Endpoints', () => {
  it('GET /api/countries should return paginated list of countries', async () => {
    const res = await request(app).get('/api/countries?page=1&limit=5');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.limit).toBe(5);
  }, 15000);

  it('GET /api/countries/search?q=india should return matching countries', async () => {
    const res = await request(app).get('/api/countries/search?q=india');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  }, 15000);

  it('GET /api/countries/regions should return available region list', async () => {
    const res = await request(app).get('/api/countries/regions');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  }, 15000);

  it('GET /api/countries/IND should return India country details', async () => {
    const res = await request(app).get('/api/countries/IND');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.cca3).toBe('IND');
  }, 15000);

  it('GET /api/countries/XYZ_INVALID should return 400 validation error', async () => {
    const res = await request(app).get('/api/countries/XYZ_INVALID');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
