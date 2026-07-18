const GITHUB_BASE = 'https://github.com/jyjulianwong'

export default function WorkflowDiagram() {
  return (
    <section className="border-t border-surface-border py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
          How the suite fits together
        </h2>
        <p className="mb-12 max-w-2xl text-sm leading-relaxed text-gray-400">
          Most tools run independently. The TradingAgents cluster is the
          exception — four components form a continuous end-to-end pipeline from
          analysis library to report viewer.
        </p>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* ── Left: TradingAgents pipeline ── */}
          <div>
            <p className="mb-5 font-mono text-xs uppercase tracking-widest text-accent">
              TradingAgents pipeline
            </p>
            <div className="flex flex-col">
              <RepoNode
                name="TradingAgents-Funds"
                href={`${GITHUB_BASE}/TradingAgents-Funds`}
                role="Fork of the open-source TradingAgents framework, extended to support fund ISINs by mapping them to representative proxy equity holdings"
              />
              <Connector label="library dependency, imported by" />
              <RepoNode
                name="TradingAgents-Funds-Runner"
                href={`${GITHUB_BASE}/TradingAgents-Funds-Runner`}
                role="Local Docker runner that executes TradingAgents-Funds for a configured watchlist of tickers and ISINs, converts each Markdown report to PDF, and uploads it to S3"
              />
              <Connector label="uploads PDF reports to" />
              <ExternalNode
                name="AWS S3 Bucket"
                role="Publicly accessible storage for the generated PDF reports"
              />
              <Connector label="browsed via" />
              <RepoNode
                name="S3 Browser"
                href={`${GITHUB_BASE}/S3-Browser-TradingAgents-Funds-Runner`}
                role="GitHub Pages-hosted file browser configured to list and open the PDF reports stored in the S3 bucket"
              />
            </div>
          </div>

          {/* ── Right: Standalone tools ── */}
          <div>
            <p className="mb-5 font-mono text-xs uppercase tracking-widest text-gray-500">
              Standalone tools
            </p>
            <div className="flex flex-col gap-4">
              <RepoNode
                name="Investment News Analysis AI"
                href={`${GITHUB_BASE}/Investment-News-Analysis-AI`}
                role="Web app and AWS serverless stack — news snippets are submitted via a GitHub Pages client, aggregated in S3, then a LangGraph Lambda agent runs daily to produce an AI-written investment analysis report"
              />
              <RepoNode
                name="Investment Fund Reporting AI"
                href={`${GITHUB_BASE}/Investment-Fund-Reporting-AI`}
                role="Claude Code automation that maintains a Google Sheets workbook with fund-style financial statements (P&L, balance sheet, returns) for a Hargreaves Lansdown Stocks & Shares ISA"
              />
              <RepoNode
                name="Turtle Quant 1"
                href={`${GITHUB_BASE}/Turtle-Quant-1`}
                role="Algorithmic equity trading assistant with modular technical and support/resistance indicators, backtesting, hyperparameter tuning, and long-running jobs orchestrated on Google Cloud Run"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function RepoNode({
  name,
  href,
  role,
}: {
  name: string
  href: string
  role: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-surface-border bg-surface-card p-4 transition-colors hover:border-accent/40"
    >
      <p className="text-sm font-medium text-white transition-colors group-hover:text-accent">
        {name}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">{role}</p>
    </a>
  )
}

function ExternalNode({ name, role }: { name: string; role: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-700 bg-surface px-4 py-3">
      <p className="text-sm font-medium text-gray-400">{name}</p>
      <p className="mt-1 text-xs text-gray-600">{role}</p>
    </div>
  )
}

function Connector({ label }: { label: string }) {
  return (
    <div className="ml-5 flex flex-col items-start gap-0.5 py-1.5">
      <div className="h-2 w-px bg-gray-700" />
      <span className="text-xs text-gray-600">{label}</span>
      <div className="h-2 w-px bg-gray-700" />
      <DownArrow />
    </div>
  )
}

function DownArrow() {
  return (
    <svg
      viewBox="0 0 10 10"
      className="h-2.5 w-2.5 text-gray-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 1v8M1.5 5.5 5 9l3.5-3.5" />
    </svg>
  )
}
