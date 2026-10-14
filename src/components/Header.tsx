import { GitBranch, Moon, Star, Sun } from 'lucide-react';
import type { Theme } from '../types/github';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  favoritesCount: number;
  onToggleFavorites: () => void;
  showFavorites: boolean;
}

export default function Header({
  theme,
  onToggleTheme,
  favoritesCount,
  onToggleFavorites,
  showFavorites,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-slate-700/60 dark:bg-[#0d1117]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2.5" aria-label="GitScope home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <GitBranch className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            GitScope
          </span>
        </a>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFavorites}
            className={`btn-ghost relative ${showFavorites ? 'border-blue-500 text-blue-600 dark:text-blue-400' : ''}`}
            aria-pressed={showFavorites}
            aria-label="Toggle favorites panel"
          >
            <Star className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-bold text-white">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="btn-ghost"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
