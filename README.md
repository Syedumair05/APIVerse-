# APIVerse – Advanced REST API Explorer 🚀

**Explore the World Through REST APIs**

🌐 **Live Website Demo**: [https://api-verse-ashy.vercel.app/](https://api-verse-ashy.vercel.app/)  
📦 **GitHub Repository**: [https://github.com/Syedumair05/APIVerse-](https://github.com/Syedumair05/APIVerse-)

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

```
APIVerse/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   ├── analyticsApi.ts        # Analytics service layer over complete dataset
│   │   └── countriesApi.ts        # Axios service layer & localStorage caching
│   ├── components/
│   │   ├── CountryCard.tsx        # Country flag & metrics card
│   │   ├── CountryDetailsModal.tsx # Full spec modal dialog & rank badge
│   │   ├── CountryGrid.tsx        # Responsive grid layout
│   │   ├── EmptyState.tsx         # No search results component
│   │   ├── ErrorState.tsx         # User-friendly network error screen
│   │   ├── FilterPanel.tsx        # Region, population & sort filters
│   │   ├── Hero.tsx               # Hero header banner
│   │   ├── LoadingSkeleton.tsx    # Card shimmer loading states
│   │   ├── Navbar.tsx             # Main header & mobile navigation
│   │   ├── Pagination.tsx         # Page controls & item counter
│   │   ├── SearchBar.tsx          # Debounced input & shortcut handler
│   │   ├── StatsCards.tsx         # Global invariant KPI statistics cards
│   │   └── ThemeToggle.tsx        # Dark/Light mode toggle switch
│   ├── context/
│   │   ├── FavoritesContext.tsx   # Favorited cca3 codes provider
│   │   └── ThemeContext.tsx       # Dark/Light theme context
│   ├── hooks/
│   │   ├── useCountries.ts        # Primary data & state hook
│   │   ├── useDebounce.ts         # Search query debouncing
│   │   └── useLocalStorage.ts     # Generic localStorage hook
│   ├── pages/
│   │   ├── About.tsx              # Documentation & architecture page
│   │   ├── Analytics.tsx          # Recharts visualization page
│   │   ├── Favorites.tsx          # Bookmarked countries page
│   │   └── Home.tsx               # Primary dashboard page
│   ├── types/
│   │   ├── analytics.ts           # Analytics interfaces
│   │   └── country.ts             # TypeScript interfaces & types
│   ├── utils/
│   │   ├── countryUtils.ts        # Formatting, density & filter helpers
│   │   └── statistics.ts          # Chart aggregations & top 10 sorters
│   ├── App.tsx                    # Router & Provider wrapper
│   ├── index.css                  # Tailwind v4 directives & glassmorphism
│   └── main.tsx                   # React root entrypoint
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 💻 Running Locally

### 1. Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### 2. Installation
Clone the repository and install dependencies:

```bash
# Install dependencies
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🚀 Live Production Links

- 🌐 **Vercel Live App**: [https://api-verse-ashy.vercel.app/](https://api-verse-ashy.vercel.app/)
- 📦 **GitHub Repository**: [https://github.com/Syedumair05/APIVerse-](https://github.com/Syedumair05/APIVerse-)

---

## 🛡️ Error Handling & Reliability

- **Network Downtime**: Displays a user-friendly error screen with a prominent **Try Again** button.
- **Timeout Management**: 12-second timeout configured on Axios to handle slow connections.
- **Graceful Fallbacks**: Missing images, capitals, or currency objects display clean `N/A` fallback labels without crashing the application.
- **Input Sanitization**: Debounced search prevents redundant filtering passes on every keystroke.

---

## 👤 Author & Acknowledgments

- **Application**: APIVerse – Advanced REST API Explorer
- **API Provider**: [REST Countries API](https://restcountries.com)
- Designed and engineered with React 19, TypeScript, and Tailwind CSS.
