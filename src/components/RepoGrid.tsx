import { useGitHubRepos } from '../hooks/useGitHubRepos'
import RepoCard from './RepoCard'

export default function RepoGrid() {
  const repos = useGitHubRepos()

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-gray-500">
        Repositories
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <RepoCard key={`${repo.config.owner}/${repo.config.name}`} repo={repo} />
        ))}
      </div>
    </section>
  )
}
