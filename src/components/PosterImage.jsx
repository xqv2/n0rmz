import { useEffect, useState } from 'react';

// <img> wrapper that swaps to a text placeholder if the source 404s.
// Browsers otherwise show their broken-image glyph + the alt text — the worst
// possible failure UI on a dark theme.
//
// `broken` resets whenever `src` changes so a previously-failed component
// instance gets a fresh chance with the new URL. Without this, a stale `true`
// from an earlier render leaves the placeholder showing even after the URL
// has changed to one that loads fine.
export const PosterImage = ({ src, alt, fallback, className = '', ...rest }) => {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [src]);

  if (broken || !src) {
    return <div className="poster-placeholder">{fallback}</div>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setBroken(true)}
      {...rest}
    />
  );
};
