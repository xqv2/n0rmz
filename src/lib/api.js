// API configuration constants for external service clients
// Combined from tmdbKey.js + rawg.js to reduce file count and centralize configuration

// VITE_TMDB_API_KEY is inlined into the public bundle at build time. TMDB v3
// read-only keys are usage-restricted (rate-limit per key) — treat as
// public-by-design, not a secret. Each contributor uses their own key in
// .env.local; CI uses the workflow secret.
export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const TMDB_BASE = 'https://api.themoviedb.org/3';

// RAWG API base URL. The admin user's API key is stored in localStorage
// (loadApiKeys in lib/storage.js) and threaded into the fetch at request time —
// never inlined into the public bundle, where VITE_* env vars would be visible
// to any visitor.
export const RAWG_BASE = 'https://api.rawg.io/api';