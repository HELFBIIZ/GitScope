import { useMemo, useState } from 'react';
import { ArrowDownWideNarrow, ChevronDown, SearchX } from 'lucide-react';
import type { GitHubRepo } from '../types/github';
import { useDebounce } from '../hooks/useDebounce';
import RepoCard from './RepoCard';
import EmptyState from './EmptyState';

type SortKey = 'stars' | 'updated' | 'name';

interface RepoListProps {
  repos: GitHubRepo[];
  username: string;
}

const PAGE_SIZE = 9;

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'stars', label: 'Most stars' },
  { value: 'updated', label: 'Recently updated' },
  { value: 'name', label: 'Name (A–Z)' },
];

export default function RepoList({ repos, username }: RepoListProps) {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [sort, setSort] = useState<SortKey>('stars');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const debouncedQuery = useDebounce(query, 250);

  const languages = useMemo(() => {
    const set = new Set<string>();
    repos.forEach((r) => {
      if (r.language) set.add(r.language);
    });
    return Array.from(set).sort();
  }, [repos]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    let result = repos;

    if (q) {
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description ?? '').toLowerCase().includes(q)
      );
    }

    if (language) {
      result = result.filter((r) => r.language === language);
    }

    const sorted = [...result];
    switch (sort) {
      case 'stars':
        sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
        break;
      case 'updated':
        sorted.sort(
          (a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
        );
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return sorted;
  }, [repos, debouncedQuery, language, sort]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const resetPagination = () => setVisibleCount(PAGE_SIZE);

  return (
    <section aria-label="Repositories">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Repositories
          <span className="ml-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {filtered.length}
          </span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing {visible.length} of {filtered.length} for @{username}
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_180px]">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPagination();
            }}
            placeholder="Filter by name or description…"
            className="input pl-9"
            aria-label="Filter repositories"
          />
          <SearchX
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        </div>

        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            resetPagination();
          }}
          className="input"
          aria-label="Filter by language"
        >
          <option value="">All languages</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <div className="relative">
          <ArrowDownWideNarrow
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortKey);
              resetPagination();
            }}
            className="input pl-9"
            aria-label="Sort repositories"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No repositories found"
          message={
            repos.length === 0
              ? `@${username} has no public repositories.`
              : 'Try adjusting your search or filters.'
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="btn-ghost"
              >
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
                Load more ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
