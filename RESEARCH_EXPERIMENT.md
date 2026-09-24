# Research Experiment Protocol & Specification

## Overview
This document outlines the scientific experimental design, configuration, instrumentation, and execution procedures for the research study:

> **"Empirical Evaluation of Multi-Tier Caching Strategies for REST API Performance"**

**Research Question:**
> *"How do different caching configurations affect the performance of a REST API application under increasing request loads?"*

---

## 1. Experimental Architecture & Configurations

The experiment compares **EXACTLY THREE** controlled configurations:

### Configuration A — NO CACHE (`CACHE_MODE=NO_CACHE`)
- **Client/localStorage Cache**: OFF
- **Backend Cache**: OFF
- **In-Memory Backend Fallback**: OFF
- **Deterministic Flow**: `Browser` → `APIVerse Backend` → `REST Countries API`
- **Headers**:
  - `X-Cache-Mode: NO_CACHE`
  - `X-Cache-Status: DISABLED`
  - `X-Cache-Store: NONE`
  - `X-External-Api-Call: true`

---

### Configuration B — BACKEND CACHE (`CACHE_MODE=BACKEND`)
- **Client/localStorage Cache**: OFF
- **Backend Cache**: ON (Sole Authoritative Store: **MongoDB**)
- **In-Memory Backend Fallback**: OFF (Disabled in `RESEARCH_MODE`)
- **Deterministic Flow**: `Browser` → `APIVerse Backend` → `MongoDB Cache` → *(on miss)* → `REST Countries API`
- **Headers (Miss)**:
  - `X-Cache-Mode: BACKEND`
  - `X-Cache-Status: MISS`
  - `X-Cache-Store: NONE`
  - `X-External-Api-Call: true`
- **Headers (Hit)**:
  - `X-Cache-Mode: BACKEND`
  - `X-Cache-Status: HIT`
  - `X-Cache-Store: MONGODB`
  - `X-External-Api-Call: false`

---

### Configuration C — DUAL-TIER CACHE (`CACHE_MODE=DUAL`)
- **Client/localStorage Cache**: ON (Browser `localStorage`, 24-hour TTL)
- **Backend Cache**: ON (MongoDB, 24-hour TTL)
- **In-Memory Backend Fallback**: OFF (Disabled in `RESEARCH_MODE`)
- **Deterministic Flow**: `Browser` → `localStorage Cache` → *(on client miss)* → `APIVerse Backend` → `MongoDB Cache` → *(on backend miss)* → `REST Countries API`

---

## 2. Environment Configurations

### Backend Environment (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/apiverse
CLIENT_URL=http://localhost:5173
COUNTRIES_API_URL=https://restcountries.com/v3.1

# Research Configuration
RESEARCH_MODE=true
CACHE_MODE=DUAL
RESEARCH_SECRET=your-research-secret-here

# Research Rate Limiter Controls
RESEARCH_RATE_LIMIT=10000
RESEARCH_RATE_WINDOW_MS=900000
```

### Frontend Environment (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_RESEARCH_MODE=true
VITE_CACHE_MODE=DUAL
```

---

## 3. Strict Research Mode & Rate Limiter Behavior

When `RESEARCH_MODE=true`:
1. **MongoDB is Sole Backend Cache**: The backend in-memory cache fallback is disabled. If MongoDB is disconnected or fails, the backend returns an HTTP 503 error (`BACKEND_CACHE_UNAVAILABLE`) rather than silently switching cache stores.
2. **Bundled Fallback Dataset Disabled**: If the external REST Countries API fails or returns an invalid payload (< 50 items), the backend returns an HTTP 502 error (`EXTERNAL_API_FAILURE`) instead of substituting `countriesData.json`.
3. **Frontend Fallback Disabled**: If the APIVerse backend fails, the frontend throws `BACKEND_REQUEST_FAILURE` instead of silently querying REST Countries API directly.
4. **Research-Specific Rate Limiting**: Normal application rate limiting is 100 requests / 15 minutes. In `RESEARCH_MODE=true`, rate limiting evaluates `RESEARCH_RATE_LIMIT` (default 10,000 requests / 15 minutes).
   - **Reason**: Normal rate limits would cause artificial HTTP 429 errors during high-concurrency k6 load tests, distorting latency and throughput metrics. The research rate limit prevents premature 429 throttling while keeping rate limiting active and controlled.

---

## 4. Research Statistics & Endpoints

### Retrieve Metrics (`GET /api/research/stats`)
Returns current backend execution counters:
```http
GET /api/research/stats
```
**Response Payload**:
```json
{
  "success": true,
  "message": "Research experiment statistics retrieved successfully.",
  "data": {
    "cacheMode": "BACKEND",
    "totalRequests": 100,
    "successfulRequests": 99,
    "failedRequests": 1,
    "backendCacheHits": 80,
    "backendCacheMisses": 20,
    "backendCacheWrites": 20,
    "externalApiCalls": 20,
    "externalApiSuccesses": 20,
    "externalApiFailures": 0
  }
}
```

### Reset Cache & Counters (`POST /api/research/clear-cache`)
Resets MongoDB `CacheModel` collection, backend in-memory cache, and resets all research counters:
```http
POST /api/research/clear-cache
Header: x-research-key: <RESEARCH_SECRET>
```

### Browser Client Metrics
In the browser, client-side metrics are accessible via window object:
```javascript
window.__APIVERSE_RESEARCH_METRICS__ = {
  clientCacheHits: 0,
  clientCacheMisses: 0,
  clientCacheWrites: 0,
  clientRequests: 0
};
```

---

## 5. Benchmark Execution Protocol

### Fixed Deterministic Benchmark Request
The primary API latency & throughput benchmark must target the single fixed request:
```http
GET /api/countries?page=1&limit=12
```

### Cold-Cache Procedure
1. Configure `CACHE_MODE` on backend and `VITE_CACHE_MODE` on frontend.
2. Execute `POST /api/research/clear-cache` (or run `npm run cache:clear` in `backend/`).
3. Execute `clearCountriesCache()` in browser dev console.
4. Execute benchmark requests.
5. Verify initial request outputs `X-Cache-Status: MISS` and `X-External-Api-Call: true`.

### Warm-Cache Procedure
1. Perform 1 warmup request to populate MongoDB / `localStorage`.
2. Verify cache populated via `GET /api/research/stats`.
3. Execute benchmark requests.
4. Verify subsequent requests output `X-Cache-Status: HIT` and `X-External-Api-Call: false`.
