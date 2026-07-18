# Investment AI Suite

A landing page for the Investment AI Suite — a collection of AI-powered tools for automating personal investment research, fund management, and reporting workflows.

**Live site:** https://jyjulianwong.github.io/Investment-AI-Suite/

## Repositories in the suite

| Repository | Description |
|---|---|
| [Investment-News-Analysis-AI](https://github.com/jyjulianwong/Investment-News-Analysis-AI) | AI-driven analysis of investment-relevant news |
| [TradingAgents-Funds](https://github.com/jyjulianwong/TradingAgents-Funds) | Fund definitions and configurations for TradingAgents |
| [TradingAgents-Funds-Runner](https://github.com/jyjulianwong/TradingAgents-Funds-Runner) | Runner for executing TradingAgents fund strategies |
| [S3-Browser-TradingAgents-Funds-Runner](https://github.com/jyjulianwong/S3-Browser-TradingAgents-Funds-Runner) | S3-backed browser UI for TradingAgents Funds Runner |
| [Investment-Fund-Reporting-AI](https://github.com/jyjulianwong/Investment-Fund-Reporting-AI) | AI-generated reporting for investment fund performance |
| [Turtle-Quant-1](https://github.com/jyjulianwong/Turtle-Quant-1) | Standalone quantitative strategy inspired by the Turtle Trading rules |

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
