import type { GitHubRepo, LanguageStat, RepoStats } from '../types/github';
import { getLanguageColor } from './languages';

export function computeRepoStats(repos: GitHubRepo[]): RepoStats {
  const sorted = [...repos];
  const originalRepos = sorted.filter((r) => !r.fork);
  const forkedRepos = sorted.filter((r) => r.fork);

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  const totalWatchers = repos.reduce((sum, r) => sum + r.watchers_count, 0);
  const openIssues = repos.reduce((sum, r) => sum + r.open_issues_count, 0);

  const languageMap = new Map<string, { count: number }>();
  repos.forEach((repo) => {
    if (!repo.language) return;
    const existing = languageMap.get(repo.language) ?? { count: 0 };
    languageMap.set(repo.language, { count: existing.count + 1 });
  });

  const languages: LanguageStat[] = Array.from(languageMap.entries())
    .map(([language, data]) => ({
      language,
      count: data.count,
      bytes: data.count,
      percentage: repos.length > 0 ? (data.count / repos.length) * 100 : 0,
      color: getLanguageColor(language),
    }))
    .sort((a, b) => b.count - a.count || a.language.localeCompare(b.language));

  const byStars = [...originalRepos].sort((a, b) => b.stargazers_count - a.stargazers_count);
  const mostStarred = byStars.slice(0, 5);

  const byPush = [...repos]
    .filter((r) => r.pushed_at)
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());

  const latestActivity = byPush[0] ?? null;
  const mostRecentPush = latestActivity?.pushed_at ?? null;

  return {
    totalRepos: repos.length,
    totalStars,
    totalForks,
    totalWatchers,
    originalRepos: originalRepos.length,
    forkedRepos: forkedRepos.length,
    languages,
    mostStarred,
    latestActivity,
    mostRecentPush,
    openIssues,
  };
}
