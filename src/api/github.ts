import type { GitHubRepo, GitHubUser } from '../types/github';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubApiError extends Error {
  status: number;
  rateLimitRemaining?: number;
  rateLimitReset?: number;

  constructor(
    message: string,
    status: number,
    rateLimitRemaining?: number,
    rateLimitReset?: number
  ) {
    super(message);
    this.name = 'GitHubApiError';
    this.status = status;
    this.rateLimitRemaining = rateLimitRemaining;
    this.rateLimitReset = rateLimitReset;
  }
}

interface RequestOptions {
  perPage?: number;
  page?: number;
}

async function request<T>(
  path: string,
  params: Record<string, string | number | undefined> = {}
): Promise<T> {
  const url = new URL(`${GITHUB_API_BASE}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  const remaining = response.headers.get('X-RateLimit-Remaining');
  const reset = response.headers.get('X-RateLimit-Reset');

  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubApiError(
        'User not found',
        404,
        Number(remaining) || 0,
        reset ? Number(reset) : undefined
      );
    }
    if (response.status === 403 || response.status === 429) {
      const resetTime = reset
        ? new Date(Number(reset) * 1000).toLocaleTimeString()
        : 'later';
      throw new GitHubApiError(
        `GitHub API rate limit exceeded. Resets at ${resetTime}. Try again later.`,
        403,
        Number(remaining) || 0,
        reset ? Number(reset) : undefined
      );
    }
    throw new GitHubApiError(
      `GitHub API request failed (${response.status})`,
      response.status
    );
  }

  return response.json() as Promise<T>;
}

export async function fetchUser(username: string): Promise<GitHubUser> {
  return request<GitHubUser>(`/users/${encodeURIComponent(username)}`);
}

export async function fetchUserRepos(
  username: string,
  options: RequestOptions = {}
): Promise<GitHubRepo[]> {
  const { perPage = 100, page = 1 } = options;
  return request<GitHubRepo[]>(`/users/${encodeURIComponent(username)}/repos`, {
    sort: 'updated',
    direction: 'desc',
    per_page: perPage,
    page,
  });
}

export async function fetchAllUserRepos(username: string): Promise<GitHubRepo[]> {
  const firstPage = await fetchUserRepos(username, { perPage: 100, page: 1 });
  if (firstPage.length < 100) return firstPage;

  const pages = await Promise.all(
    [2, 3, 4, 5].map((page) =>
      fetchUserRepos(username, { perPage: 100, page }).catch(() => [] as GitHubRepo[])
    )
  );

  return [...firstPage, ...pages.flat()];
}
