# APIVerse – Advanced REST API Explorer 🚀

**Explore the World Through REST APIs**

🌐 **Live Website Demo**: [https://api-verse-ashy.vercel.app/](https://api-verse-ashy.vercel.app/)  
📦 **GitHub Repository**: https://github.com/Syedumair05/APIVerse-

---

APIVerse is a production-grade, highly interactive React & TypeScript web application designed to consume, filter, visualize, and analyze live geographic and demographic data from the public **REST Countries API**.

---

## 🌟 Key Features

- 🌐 **Live REST API Integration**: Dynamically consumes the REST Countries API v3.1 using Axios.
- ⚡ **Debounced Search**: Instant, case-insensitive search by country common name, official name, capital city, or 3-letter CCA3 code.
- 🎛️ **Multi-Criteria Filtering & Sorting**:
  - **Region Filter**: All, Africa, Americas, Asia, Europe, Oceania.
  - **Population Bracket Filter**: Under 10M, 10M–50M, 50M–100M, Above 100M.
  - **Sorting**: Name (A-Z / Z-A), Population (Low/High), Surface Area (Low/High).
- 📊 **Interactive Analytics Dashboard**: Powered by Recharts with dynamic charts:
  - *Population by Region* (Bar Chart)
  - *Countries Breakdown by Region* (Donut / Pie Chart)
  - *Top 10 Most Populous Countries* (Horizontal Bar Chart)
  - *Top 10 Largest Countries by Land Area* (Vertical Bar Chart)
- 💖 **Favorites System**: Heart/unheart nations with persistent `localStorage` storage and a dedicated `/favorites` view.
- 💾 **Client-Side Caching**: 24-hour timestamped `localStorage` payload caching to minimize network usage, with a manual **Refresh API** header action to invalidate cache.
- 🔗 **URL State Synchronization**: Query parameters (`?search=india&region=Asia&sort=pop-desc`) bidirectionally synced with browser URL bar for shareable views.
- 📄 **Client-Side Pagination**: 12 countries per page with page numbers, prev/next controls, and item range counters.
- 🌓 **Dark & Light Mode**: Fluid theme toggle with system color scheme detection and persistent user preference.
- 📱 **Responsive Design**: Glassmorphism UI layout optimized for Desktop (4 columns), Tablet (2-3 columns), and Mobile (1 column + mobile drawer menu).
- ♿ **Accessibility & Skeletons**: Custom shimmer loading cards, accessible dialog focus handling, keyboard shortcut (`/` key to focus search bar), and friendly error boundaries.

---

## 🔬 Research & Performance Evaluation

The APIVerse application was extended with a research-oriented experimental framework to empirically evaluate REST API caching strategies under increasing request loads.

### Research Focus

**Empirical Evaluation of Multi-Tier Caching Strategies for REST API Performance**

**Research Question:**  
*How do different caching configurations affect the performance of a REST API application under increasing request loads?*

### Evaluated Configurations

- **NO_CACHE**: Client-side and backend caching disabled.
- **BACKEND**: MongoDB backend caching enabled.
- **DUAL**: Client-side `localStorage` caching combined with MongoDB backend caching.

### Benchmarking

- **Load Testing Tool**: k6
- **Primary Endpoint**: `GET /api/countries?page=1&limit=12`
- **Test Duration**: 30 seconds per run
- **Core Load Levels**: 1, 5 and 10 VUs
- **Primary Metrics**:
  - Average latency
  - P50 latency
  - P95 latency
  - P99 latency
  - Throughput
  - HTTP error rate
  - Backend cache hits/misses/writes
  - External API calls

A controlled local upstream API and research instrumentation were also introduced to support reproducible caching experiments.

Research experiment documentation and raw benchmark outputs are available in the `research/` directory.

---

## 🛠️ Recommended Tech Stack

| Technology | Role |
| :--- | :--- |
| **React 19** | Modern Declarative UI Framework |
| **TypeScript** | Strict Type Definitions & Safety |
| **Vite** | Next-Generation Frontend Tooling |
| **Axios** | HTTP Client Layer & Service Architecture |
| **Tailwind CSS v4** | Modern Utility-First CSS & Design Tokens |
| **Recharts** | Data Visualizations & Analytics Charts |
| **Lucide React** | Sleek Vector Icons |
| **React Router v7** | Single Page Application Navigation & Query Params |

---

## 📡 API Information

- **API Name**: REST Countries API
- **Endpoint**: `https://restcountries.com/v3.1/all?fields=name,flags,capital,population,area,region,subregion,currencies,languages,cca3`
- **HTTP Method**: `GET`
- **Response Format**: `JSON Array`
- **Frontend Architecture**:
  - `src/api/countriesApi.ts`: Centralized Axios instance with timeout and client-side caching layer.
  - `src/hooks/useCountries.ts`: React Hook managing request state, debouncing, multi-filtering, sorting, and URL sync.

---

## 📂 Project Structure

```text
APIVerse/
├── backend/
│   ├── src/
│   └── tests/
├── public/
│   └── favicon.svg
├── research/
│   ├── k6/
│   │   └── api_benchmark.js
│   ├── results/
│   │   └── benchmark JSON results
│   ├── upstream/
│   │   └── server.cjs
│   └── RESEARCH_EXPERIMENT.md
├── src/
│   ├── api/
│   │   ├── analyticsApi.ts        # Analytics service layer over complete dataset
│   │   └── countriesApi.ts        # Axios service layer & localStorage caching
│   ├── components/
│   │   ├── CountryCard.tsx
│   │   ├── CountryDetailsModal.tsx
│   │   ├── CountryGrid.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── Hero.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── Navbar.tsx
│   │   ├── Pagination.tsx
│   │   ├── SearchBar.tsx
│   │   ├── StatsCards.tsx
│   │   └── ThemeToggle.tsx
│   ├── context/
│   │   ├── FavoritesContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   │   ├── useCountries.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── pages/
│   │   ├── About.tsx
│   │   ├── Analytics.tsx
│   │   ├── Favorites.tsx
│   │   └── Home.tsx
│   ├── types/
│   │   ├── analytics.ts
│   │   └── country.ts
│   ├── utils/
│   │   ├── countryUtils.ts
│   │   └── statistics.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
