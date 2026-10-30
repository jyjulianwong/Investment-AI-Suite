import type { GitHubRepo } from '../hooks/useGitHubRepos'
import { useSpotlight } from '../hooks/useSpotlight'

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
  const onPointerMove = useSpotlight<HTMLElement>()
  const displayName = repo.config.name.replace(/-/g, ' ')
  const langColor = repo.language ? (LANGUAGE_COLORS[repo.language] ?? '#8b949e') : null

  if (repo.loading) return <SkeletonCard />

  return (
    <article
      onPointerMove={onPointerMove}
      className="glass spotlight group flex h-full flex-col rounded-2xl p-6"
    >
      <div className="flex-1">
        <h3 className="font-serif text-xl font-semibold leading-snug text-white transition-colors duration-200 group-hover:text-gold">
          {displayName}
        </h3>

        {repo.description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-300">{repo.description}</p>
        ) : (
          <p className="mt-3 text-sm italic text-slate-400">No description available.</p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          {langColor && repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: langColor, boxShadow: `0 0 10px ${langColor}88` }}
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
          className="flex min-h-[2.25rem] flex-shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-200 transition-colors duration-200 hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
          aria-label={`View ${displayName} on GitHub`}
        >
          View on GitHub
          <ArrowIcon />
        </a>
      </div>
    </article>
  )
}

function SkeletonCard() {
  return (
    <div className="glass flex h-full flex-col rounded-2xl p-6" aria-hidden="true">
      <div className="shimmer h-5 w-3/4 rounded" />
      <div className="mt-4 space-y-2">
        <div className="shimmer h-3 w-full rounded" />
        <div className="shimmer h-3 w-5/6 rounded" />
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
        <div className="shimmer h-3 w-20 rounded" />
        <div className="shimmer h-8 w-32 rounded-full" />
      </div>
    </div>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current text-gold" aria-hidden="true">
      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.873 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9l6-6M4 3h5v5" />
    </svg>
  )
}
