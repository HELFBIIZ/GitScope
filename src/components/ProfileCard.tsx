import {
  Bookmark,
  BookmarkCheck,
  Building2,
  Calendar,
  ExternalLink,
  Globe,
  MapPin,
  Users,
} from 'lucide-react';
import type { GitHubUser } from '../types/github';
import { formatBlogUrl, formatCount, formatDate } from '../utils/format';

interface ProfileCardProps {
  user: GitHubUser;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function ProfileCard({ user, isFavorite, onToggleFavorite }: ProfileCardProps) {
  const blogUrl = formatBlogUrl(user.blog);

  return (
    <section className="card overflow-hidden" aria-label="User profile">
      <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
      <div className="px-5 pb-5 sm:px-6">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <img
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md dark:border-[#161b22]"
              width={96}
              height={96}
            />
            <div className="pb-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {user.name ?? user.login}
              </h2>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                @{user.login}
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleFavorite}
            className={`btn-ghost shrink-0 ${isFavorite ? 'border-blue-500 text-blue-600 dark:text-blue-400' : ''}`}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            {isFavorite ? (
              <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Bookmark className="h-4 w-4" aria-hidden="true" />
            )}
            {isFavorite ? 'Saved' : 'Save'}
          </button>
        </div>

        {user.bio && (
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {user.bio}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
          {user.company && (
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-4 w-4" aria-hidden="true" />
              {user.company}
            </span>
          )}
          {user.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {user.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Joined {formatDate(user.created_at)}
          </span>
          {blogUrl && (
            <a
              href={blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-600 hover:underline dark:text-blue-400"
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              {blogUrl.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-center dark:bg-slate-800/60">
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCount(user.public_repos)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Repositories</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-center dark:bg-slate-800/60">
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCount(user.followers)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Followers</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-center dark:bg-slate-800/60">
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCount(user.following)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Following</p>
          </div>
        </div>

        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-5 w-full"
        >
          <Users className="h-4 w-4" aria-hidden="true" />
          View GitHub Profile
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
