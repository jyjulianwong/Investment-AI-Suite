import { useEffect, useState } from 'react'
import { REPOS, type RepoConfig } from '../data/repos'

export interface GitHubRepo {
  config: RepoConfig
  htmlUrl: string
  description: string | null
  language: string | null
  stargazersCount: number
  updatedAt: string
  loading: boolean
  error: boolean
}

type CachedRepoData = Pick<
  GitHubRepo,
  'htmlUrl' | 'description' | 'language' | 'stargazersCount' | 'updatedAt'
>

const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const cacheKey = (config: RepoConfig) => `gh-repo-cache:${config.owner}/${config.name}`

function readCache(config: RepoConfig): CachedRepoData | null {
  try {
    const raw = localStorage.getItem(cacheKey(config))
    if (!raw) return null
    const { data, cachedAt } = JSON.parse(raw) as { data: CachedRepoData; cachedAt: number }
    if (Date.now() - cachedAt > CACHE_TTL_MS) return null
    return data
  } catch {
    return null
  }
}

function writeCache(config: RepoConfig, data: CachedRepoData) {
  try {
    localStorage.setItem(cacheKey(config), JSON.stringify({ data, cachedAt: Date.now() }))
  } catch {
    // localStorage unavailable or full; skip caching
  }
}

async function fetchRepo(config: RepoConfig): Promise<GitHubRepo> {
  const cached = readCache(config)
  if (cached) return { config, ...cached, loading: false, error: false }

  const res = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.name}`,
    { headers: { Accept: 'application/vnd.github.v3+json' } },
  )
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json() as {
    html_url: string
    description: string | null
    language: string | null
    stargazers_count: number
    updated_at: string
  }
  const repoData: CachedRepoData = {
    htmlUrl: data.html_url,
    description: data.description,
    language: data.language,
    stargazersCount: data.stargazers_count,
    updatedAt: data.updated_at,
  }
  writeCache(config, repoData)
  return { config, ...repoData, loading: false, error: false }
}

export function useGitHubRepos(): GitHubRepo[] {
  const [repos, setRepos] = useState<GitHubRepo[]>(
    REPOS.map((config) => ({
      config,
      htmlUrl: `https://github.com/${config.owner}/${config.name}`,
      description: null,
      language: null,
      stargazersCount: 0,
      updatedAt: '',
      loading: true,
      error: false,
    })),
  )

  useEffect(() => {
    REPOS.forEach((config, index) => {
      fetchRepo(config)
        .then((repo) => {
          setRepos((prev) => {
            const next = [...prev]
            next[index] = repo
            return next
          })
        })
        .catch(() => {
          setRepos((prev) => {
            const next = [...prev]
            next[index] = { ...next[index]!, loading: false, error: true }
            return next
          })
        })
    })
  }, [])

  return repos
}
