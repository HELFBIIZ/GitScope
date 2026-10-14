import { ExternalLink, GitFork, Star } from 'lucide-react';
import type { GitHubRepo } from '../types/github';
import { getLanguageColor } from '../utils/languages';
import { formatCount, formatRelativeTime } from '../utils/format';

interface RepoCardProps {
  repo: GitHubRepo;
}

export default function RepoCard({ repo }: RepoCardProps) {
  return (
    <article className="card flex flex-col p-5 transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 text-base font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          <span className="block truncate">{repo.name}</span>
        </a>
        {repo.fork && (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Fork
          </span>
        )}
      </div>

      {repo.description ? (
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-300">
          {repo.description}
        </p>
      ) : (
        <p className="mt-2 flex-1 text-sm italic text-slate-400 dark:text-slate-500">
          No description provided.
        </p>
      )}

      {repo.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
              aria-hidden="true"
            />
            {repo.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5" aria-hidden="true" />
          {formatCount(repo.stargazers_count)}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitFork className="h-3.5 w-3.5" aria-hidden="true" />
          {formatCount(repo.forks_count)}
        </span>
        <span className="inline-flex items-center gap-1">
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          Updated {formatRelativeTime(repo.pushed_at)}
        </span>
      </div>
    </article>
  );
}
