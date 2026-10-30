import { useGitHubRepos } from '../hooks/useGitHubRepos'
import RepoCard from './RepoCard'
import RevealOnScroll from './RevealOnScroll'
import SectionHeading from './SectionHeading'

export default function RepoGrid() {
  const repos = useGitHubRepos()

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading index="01" title="Repositories" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo, index) => (
          <RevealOnScroll key={`${repo.config.owner}/${repo.config.name}`} delay={index * 90}>
            <RepoCard repo={repo} />
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}
