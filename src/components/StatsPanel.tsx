import { Activity, Code2, GitFork, Star, TrendingUp } from 'lucide-react';
import type { GitHubRepo, RepoStats } from '../types/github';
import { formatCount, formatRelativeTime } from '../utils/format';

interface StatsPanelProps {
  stats: RepoStats;
  onSelectRepo: (repo: GitHubRepo) => void;
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Star; label: string; value: string }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-lg font-bold leading-tight text-slate-900 dark:text-white">{value}</p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}

export default function StatsPanel({ stats, onSelectRepo }: StatsPanelProps) {
  if (stats.totalRepos === 0) return null;

  const topLanguages = stats.languages.slice(0, 6);

  return (
    <section className="space-y-4" aria-label="Developer statistics">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-300">
        Statistics below are calculated from the {stats.totalRepos} repositories currently fetched
        from the GitHub API.
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Code2} label="Total repos" value={formatCount(stats.totalRepos)} />
        <StatCard icon={Star} label="Total stars" value={formatCount(stats.totalStars)} />
        <StatCard icon={GitFork} label="Total forks" value={formatCount(stats.totalForks)} />
        <StatCard icon={TrendingUp} label="Open issues" value={formatCount(stats.openIssues)} />
      </div>

      {topLanguages.length > 0 && (
        <div className="card p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
            <Code2 className="h-4 w-4 text-blue-500" aria-hidden="true" />
            Language distribution
          </h3>
          <div className="space-y-3">
            {topLanguages.map((lang) => (
              <div key={lang.language}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {lang.language}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {lang.count} repo{lang.count !== 1 ? 's' : ''} · {lang.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.max(lang.percentage, 2)}%`,
                      backgroundColor: lang.color,
                    }}
                    role="progressbar"
                    aria-valuenow={Math.round(lang.percentage)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${lang.language} usage`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.mostStarred.length > 0 && (
        <div className="card p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
            <Star className="h-4 w-4 text-amber-500" aria-hidden="true" />
            Most starred repositories
          </h3>
          <ul className="space-y-2">
            {stats.mostStarred.map((repo) => (
              <li key={repo.id}>
                <button
                  type="button"
                  onClick={() => onSelectRepo(repo)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-blue-600 dark:text-blue-400">
                      {repo.name}
                    </span>
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                      {repo.description ?? 'No description'}
                    </span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <Star className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatCount(repo.stargazers_count)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.latestActivity && (
        <div className="card p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
            <Activity className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            Latest activity
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Last push to{' '}
            <a
              href={stats.latestActivity.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              {stats.latestActivity.name}
            </a>{' '}
            {stats.mostRecentPush && (
              <span className="text-slate-500 dark:text-slate-400">
                {formatRelativeTime(stats.mostRecentPush)}
              </span>
            )}
            .
          </p>
        </div>
      )}
    </section>
  );
}
