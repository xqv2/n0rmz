import { useEffect, useState } from 'react';
import { RAWG_BASE } from '../lib/rawg';

const RAWG_KEY = import.meta.env.VITE_RAWG_API_KEY;

const EMPTY = {
  developers: [],
  publishers: [],
  metacritic: null,
  esrbRating: null,
  playtime: null,
  platforms: [],
  stores: [],
  screenshots: [],
  videos: [],
  website: null,
  overview: null,
};

// Fire one RAWG detail + screenshots + videos call when a game modal opens —
// mirrors useTmdbDetails so old entries with bare schema still populate
// devs/publishers/metacritic/ESRB/stores/platforms/screenshots/videos.
// Returns empty defaults until the response lands so the modal renders
// instantly. Anything the call fails to provide leaves that field empty.
export const useRawgDetails = (movie) => {
  const [data, setData] = useState(EMPTY);

  useEffect(() => {
    setData(EMPTY);
    if (!movie || movie.type !== 'game') return;
    if (!RAWG_KEY) return;
    const idOrSlug = movie.rawgSlug || movie.rawgId || movie.slug;
    if (!idOrSlug) return;

    let cancelled = false;
    const detailUrl = new URL(`${RAWG_BASE}/games/${idOrSlug}`);
    detailUrl.searchParams.set('key', RAWG_KEY);
    const shotsUrl = new URL(`${RAWG_BASE}/games/${idOrSlug}/screenshots`);
    shotsUrl.searchParams.set('key', RAWG_KEY);
    const moviesUrl = new URL(`${RAWG_BASE}/games/${idOrSlug}/movies`);
    moviesUrl.searchParams.set('key', RAWG_KEY);

    Promise.all([
      fetch(detailUrl).then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch(shotsUrl).then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch(moviesUrl).then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]).then(([d, shotsResp, moviesResp]) => {
      if (cancelled || !d) return;
      const shots = shotsResp?.results || [];
      const vids = moviesResp?.results || [];
      setData({
        developers: (d.developers || []).map((x) => x.name),
        publishers: (d.publishers || []).map((x) => x.name),
        metacritic: d.metacritic ?? null,
        esrbRating: d.esrb_rating ? { name: d.esrb_rating.name, slug: d.esrb_rating.slug } : null,
        playtime: d.playtime || null,
        platforms: (d.platforms || []).map((p) => ({
          slug: p.platform?.slug,
          name: p.platform?.name,
        })).filter((p) => p.slug),
        stores: (d.stores || []).map((s) => ({
          slug: s.store?.slug,
          name: s.store?.name,
          domain: s.store?.domain,
          url: s.url || null,
        })).filter((s) => s.slug),
        screenshots: shots.map((s) => s.image).filter(Boolean),
        videos: vids
          .filter((v) => v.data?.['480'] || v.data?.max)
          .map((v) => ({ low: v.data?.['480'] || null, high: v.data?.max || null })),
        website: d.website || null,
        overview: d.description_raw || null,
      });
    });

    return () => { cancelled = true; };
  }, [movie]);

  return data;
};
