import { useMemo, useState } from 'react';
import { GitBranch } from 'lucide-react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ProfileCard from './components/ProfileCard';
import RepoList from './components/RepoList';
import StatsPanel from './components/StatsPanel';
import FavoritesPanel from './components/FavoritesPanel';
import Loading from './components/Loading';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import { EmptySearchState, SearchSuggestions, useProfileSearch } from './hooks/useProfileSearch';
import { useTheme } from './hooks/useTheme';
import { useFavorites } from './hooks/useFavorites';
import { computeRepoStats } from './utils/stats';
import type { GitHubRepo } from './types/github';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { favorites, removeFavorite, isFavorite, toggleFavorite } = useFavorites();
  const { user, repos, isLoading, error, search, recentSearches } = useProfileSearch();

  const [searchInput, setSearchInput] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const stats = useMemo(() => computeRepoStats(repos), [repos]);

  const handleSelectFavorite = (login: string) => {
    setSearchInput(login);
    setShowFavorites(false);
    search(login);
  };

  const handleSelectRepo = (repo: GitHubRepo) => {
    window.open(repo.html_url, '_blank', 'noopener,noreferrer');
  };

  const handleSearch = () => {
    if (searchInput.trim()) search(searchInput);
  };

  return (
    <div className="min-h-screen">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        favoritesCount={favorites.length}
        onToggleFavorites={() => setShowFavorites((v) => !v)}
        showFavorites={showFavorites}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
            Powered by the GitHub REST API
          </div>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            GitScope
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Discover GitHub profiles, explore repositories, and analyze developer activity — all in
            one clean dashboard.
          </p>
        </div>

        <div className="mx-auto mb-8 max-w-2xl">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={handleSearch}
            isLoading={isLoading}
          />
        </div>

        {error && (
          <div className="mx-auto mb-8 max-w-2xl">
            <ErrorState message={error} onRetry={handleSearch} />
          </div>
        )}

        {isLoading && <Loading message="Fetching GitHub profile…" fullScreen />}

        {!isLoading && !error && !user && (
          <div className="space-y-6">
            <EmptySearchState />
            <SearchSuggestions onSelect={handleSearch} recentSearches={recentSearches} />
          </div>
        )}

        {!isLoading && !error && user && (
          <div className="animate-fade-in space-y-8">
            <ProfileCard
              user={user}
              isFavorite={isFavorite(user.login)}
              onToggleFavorite={() =>
                toggleFavorite({
                  login: user.login,
                  avatar_url: user.avatar_url,
                  html_url: user.html_url,
                  name: user.name,
                  savedAt: new Date().toISOString(),
                })
              }
            />

            <StatsPanel stats={stats} onSelectRepo={handleSelectRepo} />

            {repos.length === 0 ? (
              <EmptyState
                icon={GitBranch}
                title="No public repositories"
                message={`@${user.login} hasn't published any public repositories yet.`}
              />
            ) : (
              <RepoList repos={repos} username={user.login} />
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
        GitScope · Data from the{' '}
        <a
          href="https://docs.github.com/rest"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          GitHub REST API
        </a>
      </footer>

      <FavoritesPanel
        open={showFavorites}
        favorites={favorites}
        onClose={() => setShowFavorites(false)}
        onSelect={handleSelectFavorite}
        onRemove={removeFavorite}
      />
    </div>
  );
}
