# Investment AI Suite

A landing page for the Investment AI Suite — a collection of AI-powered tools for automating personal investment research, fund management, and reporting workflows.

**Live site:** https://jyjulianwong.github.io/Investment-AI-Suite/

## Repositories in the suite

| Repository | Description |
|---|---|
| [Investment-News-Analysis-AI](https://github.com/jyjulianwong/Investment-News-Analysis-AI) | A minimal web app + AWS serverless stack that aggregates daily news snippets and produces AI-generated investment analysis reports |
| [TradingAgents-Funds](https://github.com/jyjulianwong/TradingAgents-Funds) | A forked, modified version of "TradingAgents: Multi-Agents LLM Financial Trading Framework" |
| [TradingAgents-Funds-Runner](https://github.com/jyjulianwong/TradingAgents-Funds-Runner) | A local Docker-based runner that runs TradingAgents-Funds for a personal fund watchlist, converts each Markdown report to PDF, and uploads the result to a public AWS S3 bucket |
| [S3-Browser-TradingAgents-Funds-Runner](https://github.com/jyjulianwong/S3-Browser-TradingAgents-Funds-Runner) | A simple explorer for Amazon S3 buckets |
| [Investment-Fund-Reporting-AI](https://github.com/jyjulianwong/Investment-Fund-Reporting-AI) | A personal Claude Code automation project for maintaining a Google Sheets workbook that produces fund-style financial statements for a Hargreaves Lansdown Stocks & Shares ISA |
| [Turtle-Quant-1](https://github.com/jyjulianwong/Turtle-Quant-1) | A personal algorithmic equity trading assistant |

## Development

```bash
npm install
npm run dev
```

## Adding a new repo

Open `src/data/repos.ts` and append an entry to the `REPOS` array:

```ts
{ owner: 'jyjulianwong', name: 'Your-New-Repo' },
```

All metadata (description, language, stars) is fetched live from the GitHub API — no other changes needed.

## Deployment

Pushing to `main` triggers the GitHub Actions workflow in `.github/workflows/deploy.yml`, which builds the Vite app and deploys the `dist/` output to GitHub Pages.

Before the first deploy, enable GitHub Pages in the repository settings:
**Settings → Pages → Source → GitHub Actions**
