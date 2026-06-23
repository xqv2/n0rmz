// Device detection and feature detection constants
// Centralized for consistency across components and hooks

const IS_TOUCH = typeof window !== 'undefined'
  && window.matchMedia?.('(hover: none), (pointer: coarse)').matches;

// Media query for touch devices
const TOUCH_MEDIA_QUERY = '(hover: none), (pointer: coarse)';

// Max tilt in degrees — kept gentle so the parallax reads as polish, not a toy.
const TILT_MAX = 7;

// Spring animation configuration for tilt effects
const TILT_SPRING = { stiffness: 220, damping: 18, mass: 0.6 };

// Cascade the meta-block contents in: title → notes → media → specs →
// platforms. Each child fades+rises in turn so the modal feels assembled, not
// dumped. Numbers are tuned to land just after the modal's scale-in finishes.
const META_PARENT = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.035, delayChildren: 0.14 } },
};

const META_ITEM = {
  hidden: { opacity: 0, y: 11 },
  show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] } },
};

const formatRuntime = (mins) => {
  if (!mins) return null;
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

const scoreTier = (score) => (score >= 75 ? 'good' : score >= 50 ? 'mixed' : 'bad');

// Tab type labels for UI display
const TYPE_LABEL = { movie: 'Movie', show: 'Show', game: 'Game' };

export { IS_TOUCH, TOUCH_MEDIA_QUERY, TILT_MAX, TILT_SPRING };
export { META_PARENT, META_ITEM };
export { formatRuntime, scoreTier, TYPE_LABEL };