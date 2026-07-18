export interface RepoConfig {
  owner: string
  name: string
}

/**
 * Add a new repo to the suite by appending an entry here.
 * All other metadata (description, stars, language, etc.) is fetched live from GitHub.
 */
export const REPOS: RepoConfig[] = [
  { owner: 'jyjulianwong', name: 'Investment-News-Analysis-AI' },
  { owner: 'jyjulianwong', name: 'TradingAgents-Funds' },
  { owner: 'jyjulianwong', name: 'TradingAgents-Funds-Runner' },
  { owner: 'jyjulianwong', name: 'S3-Browser-TradingAgents-Funds-Runner' },
  { owner: 'jyjulianwong', name: 'Investment-Fund-Reporting-AI' },
  { owner: 'jyjulianwong', name: 'Turtle-Quant-1' },
]
