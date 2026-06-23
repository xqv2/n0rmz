// Consolidated metadata definitions for the media tracking application
// Merged from tabs.js, tiers.js, badges.js, gamePlatforms.js, filters.js
// Single source of truth for all metadata and lookup tables

import { Film, Tv, Gamepad2 } from 'lucide-react';
import { Globe, Monitor } from 'lucide-react';

// Personal-rating tiers shown on the public site (filter slider).
export const MY_SCORE_TIERS = [
  { label: 'Any', min: 0 },
  { label: 'Good', min: 7 },
  { label: 'Great', min: 8 },
  { label: 'Amazing', min: 9 },
];

// Tiers used in the admin to set a numeric score on a card.
export const SCORE_TIERS = [
  { label: 'Clear', value: null, hint: 'No score' },
  { label: 'Good', value: 7, hint: '7.0' },
  { label: 'Great', value: 8, hint: '8.0' },
  { label: 'Amazing', value: 9.2, hint: '9.2' },
];

export const tierLabelFor = (score) => {
  if (score == null) return null;
  if (score >= 9) return 'Amazing';
  if (score >= 8) return 'Great';
  if (score >= 7) return 'Good';
  return null;
};

// Tab definitions for navigation and filtering
export const TABS = ['Movies', 'Shows', 'Games'];
export const TYPE_FOR_TAB = { Movies: 'movie', Shows: 'show', Games: 'game' };
export const ICON_FOR_TAB = { Movies: Film, Shows: Tv, Games: Gamepad2 };

export const computeTabCounts = (moviesData) =>
  TABS.reduce((acc, id) => {
    const key = TYPE_FOR_TAB[id];
    acc[id] = moviesData.reduce((n, m) => (m.type === key ? n + 1 : n), 0);
    return acc;
  }, {});

// Badge field definitions for movies/shows and games
export const BADGE_FIELDS_FILM = [
  { key: 'twist',            label: 'Twist',             img: '/badges/twist.png' },
  { key: 'scary',            label: 'Scary',             img: '/badges/scary.png' },
  { key: 'intense',          label: 'Intense',           img: '/badges/intense.png' },
  { key: 'mindbending',      label: 'Mind-bending',      img: '/badges/mindbending.png' },
  { key: 'mindblowing',      label: 'Mind-blowing',      img: '/badges/mindblowing.png' },
  { key: 'clever',           label: 'Clever',            img: '/badges/clever.png' },
  { key: 'thrilling',        label: 'Thrilling',         img: '/badges/thrilling.png' },
  { key: 'epic',             label: 'Epic',              img: '/badges/epic.png' },
  { key: 'mustsee',          label: 'Must-see',          img: '/badges/mustsee.png' },
  { key: 'visuallystunning', label: 'Visually stunning', img: '/badges/visuallystunning.png' },
  { key: 'heartwarming',     label: 'Heartwarming',      img: '/badges/heartwarming.png' },
  { key: 'emotional',        label: 'Emotional',         img: '/badges/emotional.png' },
  { key: 'inspiring',        label: 'Inspiring',         img: '/badges/inspiring.png' },
  { key: 'funny',            label: 'Funny',             img: '/badges/funny.png' },
  { key: 'nostalgic',        label: 'Nostalgic',         img: '/badges/nostalgic.png' },
  { key: 'rewatchable',      label: 'Rewatchable',       img: '/badges/rewatchable.png' },
  { key: 'unique',           label: 'Unique',            img: '/badges/unique.png' },
  { key: 'wellwritten',      label: 'Well written',      img: '/badges/wellwritten.png' },
  { key: 'therapeutic',      label: 'Therapeutic',       img: '/badges/therapeutic.png' },
];

export const BADGE_FIELDS_GAMES = [
  { key: 'nostalgia',    label: 'Nostalgic',     img: '/badges/games/nostalgia.png' },
  { key: 'addictive',    label: 'Addictive',     img: '/badges/games/addictive.png' },
  { key: 'coop',         label: 'Co-op',         img: '/badges/games/coop.png' },
  { key: 'greatstory',   label: 'Great story',   img: '/badges/games/great-story.png' },
  { key: 'immersive',    label: 'Immersive',     img: '/badges/games/immersive.png' },
];

export const badgeFieldsFor = (type) =>
  type === 'game' ? BADGE_FIELDS_GAMES : BADGE_FIELDS_FILM;

export const pickPosterBadge = (movie) => {
  if (!movie) return null;
  for (const b of badgeFieldsFor(movie.type)) {
    if (movie[b.key]) return { src: b.img, alt: b.label };
  }
  return null;
};

// Platform and store metadata for games
// Maps RAWG parent_platform.slug and store.slug to display label + an optional
// branded icon source. Some gaming brands (PlayStation, Xbox, Nintendo) were
// removed from simple-icons, so we use Google's favicon service via
// `iconDomain` for those. PC/Web/Linux fall back to a lucide Icon.
export const PLATFORM_META = {
  pc:          { label: 'PC',          Lucide: Monitor },
  playstation: { label: 'PlayStation', iconDomain: 'playstation.com' },
  xbox:        { label: 'Xbox',        iconDomain: 'xbox.com' },
  nintendo:    { label: 'Nintendo',    iconDomain: 'nintendo.com' },
  mac:         { label: 'Mac',         simpleIcon: 'apple' },
  linux:       { label: 'Linux',       simpleIcon: 'linux' },
  android:     { label: 'Android',     iconDomain: 'android.com' },
  ios:         { label: 'iOS',         iconDomain: 'apple.com' },
  web:         { label: 'Web',         Lucide: Globe },
};

// Slugs that shouldn't be offered as a filter chip — too granular or
// duplicate-ish in normal browsing. Detail modal can still show them.
export const HIDDEN_PLATFORM_SLUGS = new Set(['mac', 'linux', 'web']);

export const STORE_META = {
  steam:               { label: 'Steam',           simpleIcon: 'steam' },
  gog:                 { label: 'GOG',             simpleIcon: 'gogdotcom' },
  'playstation-store': { label: 'PlayStation',     simpleIcon: 'playstation' },
  'xbox-store':        { label: 'Microsoft Store', simpleIcon: 'xbox', hidden: true },
  xbox360:             { label: 'Xbox',            simpleIcon: 'xbox' },
  nintendo:            { label: 'Nintendo',        simpleIcon: 'nintendoswitch' },
  'epic-games':        { label: 'Epic',            simpleIcon: 'epicgames' },
  itch:                { label: 'itch.io',         simpleIcon: 'itchdotio' },
  'google-play':       { label: 'Google Play',     simpleIcon: 'googleplay' },
  'apple-appstore':    { label: 'App Store',       simpleIcon: 'appstore' },
};

export const simpleIconUrl = (slug, color = 'ffffff') =>
  `https://cdn.simpleicons.org/${slug}/${color}`;

export const faviconUrl = (domain) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

// Year filtering and shuffle utilities
export const yearBucket = (year) => {
  if (!year) return null;
  if (year >= 2020) return '2020s';
  if (year >= 2010) return '2010s';
  if (year >= 2000) return '2000s';
  if (year >= 1990) return '1990s';
  if (year >= 1980) return '1980s';
  return 'Older';
};

// Per-page-load shuffle order. Lazy: assign a stable random key the first time
// we see each id, so items added after the initial fetch still get a real key
// instead of clustering at the fallback.
export const SHUFFLE_KEY = (() => {
  const map = new Map();
  return {
    get(id) {
      if (!map.has(id)) map.set(id, Math.random());
      return map.get(id);
    },
  };
})();