import request from 'supertest';
import app from '../src/app';

describe('Favorites Endpoints', () => {
  const testCountry = {
    countryCode: 'JPN',
    countryName: 'Japan',
  };

  it('GET /api/favorites should return user favorites list', async () => {
    const res = await request(app).get('/api/favorites');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/favorites should add a new favorite', async () => {
    const res = await request(app).post('/api/favorites').send(testCountry);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.countryCode).toBe('JPN');
  });

  it('POST /api/favorites should prevent duplicate favorites', async () => {
    const res = await request(app).post('/api/favorites').send(testCountry);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('DUPLICATE_FAVORITE');
  });

  it('DELETE /api/favorites/:countryCode should remove a favorite', async () => {
    const res = await request(app).delete('/api/favorites/JPN');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.countryCode).toBe('JPN');
  });
});
