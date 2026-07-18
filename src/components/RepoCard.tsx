import type { GitHubRepo } from '../hooks/useGitHubRepos'

const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Shell: '#89e051',
}

interface RepoCardProps {
  repo: GitHubRepo
}

export default function RepoCard({ repo }: RepoCardProps) {
  const displayName = repo.config.name.replace(/-/g, ' ')
  const langColor = repo.language ? (LANGUAGE_COLORS[repo.language] ?? '#8b949e') : null

  if (repo.loading) return <SkeletonCard />

  return (
    <article className="group flex flex-col rounded-lg border border-surface-border bg-surface-card p-6 transition-colors hover:border-accent/40">
      <div className="flex-1">
        <h2 className="text-base font-semibold text-white group-hover:text-accent transition-colors leading-snug">
          {displayName}
        </h2>

        {repo.description ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-400 line-clamp-3">
            {repo.description}
          </p>
        ) : (
          <p className="mt-2 text-sm italic text-gray-600">No description available.</p>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {langColor && repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: langColor }}
                aria-hidden="true"
              />
              {repo.language}
            </span>
          )}
          {!repo.error && (
            <span className="flex items-center gap-1">
              <StarIcon />
              {repo.stargazersCount}
            </span>
          )}
        </div>

        <a
          href={repo.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 rounded-md border border-surface-border bg-surface px-3 py-1.5 text-xs font-medium text-gray-300 transition-all hover:border-accent hover:text-accent"
          aria-label={`View ${displayName} on GitHub`}
        >
          View on GitHub
        </a>
      </div>
    </article>
  )
}

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-lg border border-surface-border bg-surface-card p-6 animate-pulse">
      <div className="h-4 w-3/4 rounded bg-gray-800" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-gray-800" />
        <div className="h-3 w-5/6 rounded bg-gray-800" />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="h-3 w-20 rounded bg-gray-800" />
        <div className="h-7 w-28 rounded-md bg-gray-800" />
      </div>
    </div>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.873 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
    </svg>
  )
}
