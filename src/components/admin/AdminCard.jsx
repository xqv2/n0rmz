import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { tierLabelFor, SCORE_TIERS, pickPosterBadge } from '../../lib/metadata';
import { ConfirmDialog } from './ConfirmDialog';

export const AdminCard = ({ movie, edited, onPosterClick, onScore, onNotes, onDelete, onRestore }) => {
  const personal = movie.ratings?.personal;
  const personalTier = tierLabelFor(personal);
  const secondaryBadge = pickPosterBadge(movie);
  const isDeleted = movie._deleted;
  const isGame = movie.type === 'game';
  const rawHero = movie.poster || movie.screenshots?.[0] || null;
  // Same cache-bust trick as MovieCard.jsx — browsers stick to cached
  // failed-load results from before a poster was committed. Without this,
  // the admin shows broken thumbnails for any title whose poster 404'd at
  // any earlier visit, even though the file now exists in the repo.
  const heroImage = rawHero && rawHero.startsWith('/posters/')
    ? `${rawHero}?v=3`
    : rawHero;
  const stop = (e) => e.stopPropagation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleTrashClick = (e) => {
    e.stopPropagation();
    if (isDeleted) onRestore();
    else setConfirmOpen(true);
  };

  return (
    <div className={`movie-card admin-card ${edited ? 'edited' : ''} ${isDeleted ? 'deleted' : ''} ${isGame ? 'game-card' : ''}`}>
      <div className="movie-card-inner" onClick={onPosterClick}>
        {secondaryBadge && (
          <img src={secondaryBadge.src} alt={secondaryBadge.alt} className="poster-badge badge-twist-solo" />
        )}
        <div className={`poster-container ${isGame ? 'horizontal' : ''}`}>
          <button
            className="card-trash-btn"
            onClick={handleTrashClick}
            aria-label={isDeleted ? 'Restore' : 'Delete'}
            title={isDeleted ? 'Restore' : 'Delete from movies.json'}
          >
            <Trash2 size={12} />
          </button>
          {personalTier && (
            <div className={`rating-badge tier-${personalTier.toLowerCase()}`}>
              <span className="badge-dot" />
              <span>{personalTier}</span>
            </div>
          )}
          {heroImage ? (
            <img
              src={heroImage}
              alt={`Poster for ${movie.title}`}
              loading="lazy"
              decoding="async"
              width="240"
              height="360"
              className="poster-img"
            />
          ) : (
            <div className="poster-placeholder">{movie.title}</div>
          )}
          {isDeleted && <div className="deleted-overlay"><Trash2 size={28} /></div>}
          {edited && !isDeleted && <div className="edited-tag">edited</div>}
        </div>
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <span className="movie-year">
            {movie.year}{movie.language ? ` · ${movie.language}` : ''}
          </span>
        </div>
      </div>

      <div className="card-score" onClick={stop}>
        {SCORE_TIERS.map((t) => {
          const active = t.value == null ? personal == null : personal === t.value;
          return (
            <button
              key={t.label}
              type="button"
              className={`card-score-seg ${active ? 'active' : ''} tier-${t.label.toLowerCase()}`}
              onClick={() => onScore(t.value)}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <textarea
        className="card-notes"
        placeholder="Notes…"
        value={movie.notes ?? ''}
        onChange={(e) => onNotes(e.target.value)}
        onClick={stop}
        rows={2}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Remove this title?"
        message={`"${movie.title}" will be deleted from movies.json on the next save.`}
        confirmLabel="Remove"
        destructive
        onConfirm={onDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
};
