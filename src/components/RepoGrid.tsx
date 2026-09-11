import { useGitHubRepos } from '../hooks/useGitHubRepos'
import RepoCard from './RepoCard'

export default function RepoGrid() {
  const repos = useGitHubRepos()

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="sticky top-0 z-10 -mx-6 mb-8 border-b border-surface-border bg-surface/90 px-6 py-4 text-sm font-semibold uppercase tracking-widest text-gray-500 backdrop-blur">
        Repositories
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo, index) => (
          <div
            key={`${repo.config.owner}/${repo.config.name}`}
            className="animate-fly-in"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <RepoCard repo={repo} />
          </div>
        ))}
      </div>
    </section>
  )
}
