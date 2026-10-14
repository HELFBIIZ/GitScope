export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  type: string;
  site_admin: boolean;
}

export type RepoSortOption =
  | 'updated'
  | 'created'
  | 'pushed'
  | 'full_name'
  | 'stargazers_count';

export interface GitHubRepo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    type: string;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  forks_count: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  forks: number;
  open_issues_count: number;
  is_template: boolean;
  topics: string[];
  visibility: string;
  pushed_at: string;
  created_at: string;
  updated_at: string;
  default_branch: string;
}

export interface LanguageStat {
  language: string;
  count: number;
  bytes: number;
  percentage: number;
  color: string;
}

export interface RepoStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  originalRepos: number;
  forkedRepos: number;
  languages: LanguageStat[];
  mostStarred: GitHubRepo[];
  latestActivity: GitHubRepo | null;
  mostRecentPush: string | null;
  openIssues: number;
}

export type Theme = 'light' | 'dark';

export interface FavoriteUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  savedAt: string;
}
