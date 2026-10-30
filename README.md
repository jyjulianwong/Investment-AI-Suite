# Investment AI Suite

A landing page for the [Investment AI Suite](https://jyjulianwong.github.io/Investment-AI-Suite/) — a collection of AI-powered tools for automating personal investment research, fund management, and reporting workflows.

## Repositories in the suite

| Repository | Description |
|---|---|
| [Investment-News-Analysis-AI](https://github.com/jyjulianwong/Investment-News-Analysis-AI) | A minimal web app + AWS serverless stack that aggregates daily news snippets and produces AI-generated investment analysis reports |
| [TradingAgents-Funds](https://github.com/jyjulianwong/TradingAgents-Funds) | A forked, modified version of "TradingAgents: Multi-Agents LLM Financial Trading Framework" |
| [TradingAgents-Funds-Runner](https://github.com/jyjulianwong/TradingAgents-Funds-Runner) | A local Docker-based runner that runs TradingAgents-Funds for a personal fund watchlist, converts each Markdown report to PDF, and uploads the result to a public AWS S3 bucket |
| [S3-Browser-TradingAgents-Funds-Runner](https://github.com/jyjulianwong/S3-Browser-TradingAgents-Funds-Runner) | A simple explorer for Amazon S3 buckets |
| [Investment-Fund-Reporting-AI](https://github.com/jyjulianwong/Investment-Fund-Reporting-AI) | A personal Claude Code automation project for maintaining a Google Sheets workbook that produces fund-style financial statements for a Hargreaves Lansdown Stocks & Shares ISA |
| [Turtle-Quant-1](https://github.com/jyjulianwong/Turtle-Quant-1) | A personal algorithmic equity trading assistant |
| [Market-Regime-Detector](https://github.com/jyjulianwong/Market-Regime-Detector) | A macro-economic regime classification model based on the Bridgewater All Weather macro quadrants |

## Development

```bash
npm install
npm run dev
```

## Adding a new repo

Three places need updating — see `CLAUDE.md` for the full checklist:

1. `src/data/repos.ts` — append `{ owner: 'jyjulianwong', name: 'Your-New-Repo' }` to the `REPOS` array (metadata is fetched live from the GitHub API).
2. `README.md` — add a row to the table above.
3. `src/components/WorkflowDiagram.tsx` — add a node to the "How the suite fits together" diagram.

## Deployment

Pushing to `main` triggers the GitHub Actions workflow in `.github/workflows/deploy.yml`, which builds the Vite app and deploys the `dist/` output to GitHub Pages.

Before the first deploy, enable GitHub Pages in the repository settings:
**Settings → Pages → Source → GitHub Actions**
