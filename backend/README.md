# APIVerse Backend 🚀

**Production-Quality Express + TypeScript REST API Gateway**

🌐 **Frontend Live Demo**: [https://api-verse-ashy.vercel.app/](https://api-verse-ashy.vercel.app/)  
📦 **GitHub Repository**: [https://github.com/Syedumair05/APIVerse-](https://github.com/Syedumair05/APIVerse-)

---

The **APIVerse Backend** acts as a secure, cached, validated, and rate-limited REST API layer between the React frontend and the public REST Countries API, with MongoDB persistence for user favorites and backend payload caching.

---

## 🌟 Architecture & Features

- 🏗️ **Clean Separated Architecture**: Routes → Controllers → Services → Models.
- 🔒 **Security Hardened**: Helmet HTTP headers, CORS origin control, express-rate-limit protection.
- ⚡ **Backend Caching**: 24-hour TTL caching (MongoDB `CacheModel` with TTL index + in-memory fallback) to minimize external requests to REST Countries API.
- 🎯 **Zod Input Validation**: Strict validation for pagination, sorting, region parameters, and favorite POST bodies.
- 💖 **User Favorites**: MongoDB schema storing `countryCode`, `countryName`, `userId`, and `createdAt` timestamps with indexes.
- 📊 **Analytics Engine**: Calculates country statistics, regional populations, average demographics, and top 10 nations.
- 📖 **Swagger OpenAPI 3.0 Documentation**: Interactive UI documentation at `/api-docs`.
- 🩺 **Health Monitoring**: System health & MongoDB connection status at `/api/health`.

---

## 📡 REST API Endpoints Summary

### Health & Docs
- `GET /api/health` - Health check status and MongoDB connection info
- `GET /api-docs` - Interactive Swagger OpenAPI UI

### Countries
- `GET /api/countries` - Paginated, filtered, searched, and sorted list of countries (`?page=1&limit=12&search=india&region=Asia&sort=pop-desc`)
- `GET /api/countries/search?q=query` - Quick search endpoint
- `GET /api/countries/regions` - List of available global regions
- `POST /api/countries/refresh` - Invalidate cache and fetch fresh REST Countries payload
- `GET /api/countries/:code` - Details for a nation by CCA2 or CCA3 code (e.g., `/api/countries/IND`)

### Analytics
- `GET /api/analytics/overview` - Overview metrics (total population, surface area, average, top nations)
- `GET /api/analytics/regions` - Region demographics for Recharts
- `GET /api/analytics/top-population?limit=10` - Top populated nations
- `GET /api/analytics/top-area?limit=10` - Top largest surface area nations

### Favorites
- `GET /api/favorites` - Retrieve saved bookmarks
- `POST /api/favorites` - Add country to favorites (Body: `{ "countryCode": "IND", "countryName": "India" }`)
- `DELETE /api/favorites/:countryCode` - Remove country from favorites

---

## 🛠️ Environment Variables

Create a `.env` file in `backend/` (refer to `.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/apiverse
CLIENT_URL=http://localhost:5173
COUNTRIES_API_URL=https://restcountries.com/v3.1
CACHE_TTL_MINUTES=1440
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 💻 Running the Backend Locally

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install npm dependencies
npm install

# 3. Start development server (with auto-reload)
npm run dev

# 4. Run Jest test suite
npm test

# 5. Build for production
npm run build

# 6. Start production server
npm start
```

Server running at: `http://localhost:5000`  
Swagger Documentation: `http://localhost:5000/api-docs`  
Health Status: `http://localhost:5000/api/health`  
