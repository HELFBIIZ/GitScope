import { useCallback, useEffect, useState } from 'react';
import { History, SearchX } from 'lucide-react';
import type { GitHubRepo, GitHubUser } from '../types/github';
import { fetchAllUserRepos, fetchUser, GitHubApiError } from '../api/github';

const RECENT_KEY = 'gitscope-recent-searches';
const MAX_RECENT = 6;

function readRecent(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function useProfileSearch() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(readRecent);

  useEffect(() => {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);

  const search = useCallback(async (username: string) => {
    const trimmed = username.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);
    setUser(null);
    setRepos([]);

    try {
      const profile = await fetchUser(trimmed);
      const repoList = await fetchAllUserRepos(profile.login);
      setUser(profile);
      setRepos(repoList);
      setRecentSearches((prev) => {
        const next = [
          profile.login,
          ...prev.filter((s) => s.toLowerCase() !== profile.login.toLowerCase()),
        ];
        return next.slice(0, MAX_RECENT);
      });
    } catch (err) {
      if (err instanceof GitHubApiError) {
        if (err.status === 404) {
          setError(`GitHub user "${trimmed}" was not found. Check the spelling and try again.`);
        } else {
          setError(err.message);
        }
      } else {
        setError('Network error. Check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearRecent = useCallback(() => setRecentSearches([]), []);

  return { user, repos, isLoading, error, search, recentSearches, clearRecent };
}

interface SearchSuggestionsProps {
  onSelect: (login: string) => void;
  recentSearches: string[];
}

export function SearchSuggestions({ onSelect, recentSearches }: SearchSuggestionsProps) {
  if (recentSearches.length === 0) return null;

  return (
    <div className="card p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
        <History className="h-4 w-4 text-blue-500" aria-hidden="true" />
        Recent searches
      </h3>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((login) => (
          <button
            key={login}
            type="button"
            onClick={() => onSelect(login)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-blue-400"
          >
            @{login}
          </button>
        ))}
      </div>
    </div>
  );
}

export function EmptySearchState() {
  return (
    <div className="card flex flex-col items-center gap-4 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
        <SearchX className="h-8 w-8" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Explore any GitHub developer
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          Enter a username above to view their profile, repositories, and developer statistics —
          all powered by the GitHub REST API.
        </p>
      </div>
    </div>
  );
}
