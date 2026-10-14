import { Star, Trash2, X } from 'lucide-react';
import type { FavoriteUser } from '../types/github';

interface FavoritesPanelProps {
  open: boolean;
  favorites: FavoriteUser[];
  onClose: () => void;
  onSelect: (login: string) => void;
  onRemove: (login: string) => void;
}

export default function FavoritesPanel({
  open,
  favorites,
  onClose,
  onSelect,
  onRemove,
}: FavoritesPanelProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Saved favorites"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close favorites panel"
      />
      <aside className="relative flex h-full w-full max-w-sm flex-col border-l border-slate-200 bg-white shadow-2xl animate-fade-in dark:border-slate-700 dark:bg-[#161b22]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <Star className="h-4 w-4 text-amber-500" aria-hidden="true" />
            Favorites
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {favorites.length}
            </span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost h-8 w-8 !px-0"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {favorites.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Star className="h-7 w-7 text-slate-400" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                No favorites yet
              </p>
              <p className="max-w-[220px] text-xs text-slate-500 dark:text-slate-400">
                Search for a GitHub user and tap "Save" to keep them here for quick access.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {favorites.map((fav) => (
                <li
                  key={fav.login}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60"
                >
                  <img
                    src={fav.avatar_url}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={() => onSelect(fav.login)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {fav.name ?? fav.login}
                    </span>
                    <span className="block truncate text-xs text-blue-600 dark:text-blue-400">
                      @{fav.login}
                    </span>
                  </button>
                  <a
                    href={fav.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded p-1.5 text-slate-400 hover:text-blue-600"
                    aria-label={`Open ${fav.login} on GitHub`}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                  <button
                    type="button"
                    onClick={() => onRemove(fav.login)}
                    className="rounded p-1.5 text-slate-400 hover:text-red-500"
                    aria-label={`Remove ${fav.login} from favorites`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
