import { useGitHubRepos } from '../hooks/useGitHubRepos'
import RepoCard from './RepoCard'
import { useMediaQuery } from '../hooks/useMediaQuery'
import RevealOnScroll from './RevealOnScroll'
import SectionHeading from './SectionHeading'

export default function RepoGrid() {
  const repos = useGitHubRepos()
  // Mirrors the grid breakpoints (sm:grid-cols-2, lg:grid-cols-3) so the stagger restarts on each row.
  const isLg = useMediaQuery('(min-width: 1024px)')
  const isSm = useMediaQuery('(min-width: 640px)')
  const columns = isLg ? 3 : isSm ? 2 : 1

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading index="01" title="Repositories" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo, index) => (
          <RevealOnScroll key={`${repo.config.owner}/${repo.config.name}`} delay={(index % columns) * 90}>
            <RepoCard repo={repo} />
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}
