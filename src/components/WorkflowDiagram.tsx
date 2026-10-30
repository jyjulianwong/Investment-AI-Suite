import { useSpotlight } from '../hooks/useSpotlight'
import RevealOnScroll from './RevealOnScroll'
import SectionHeading from './SectionHeading'

const GITHUB_BASE = 'https://github.com/jyjulianwong'

export default function WorkflowDiagram() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading index="02" title="How the suite fits together">
        Most tools run independently. The TradingAgents cluster is the exception — four components form a continuous
        end-to-end pipeline from analysis library to report viewer.
      </SectionHeading>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ── Left: TradingAgents pipeline ── */}
        <div className="glass rounded-3xl p-6 sm:p-8">
          <p className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_#e7c47e]" aria-hidden="true" />
            TradingAgents pipeline
          </p>
          <div className="flex flex-col">
            <RevealOnScroll delay={0}>
              <Step n={1}>
                <RepoNode
                  name="TradingAgents-Funds"
                  href={`${GITHUB_BASE}/TradingAgents-Funds`}
                  role="Fork of the open-source TradingAgents framework, extended to support fund ISINs by mapping them to representative proxy equity holdings"
                />
              </Step>
            </RevealOnScroll>
            <RevealOnScroll delay={65}>
              <Connector label="library dependency, imported by" />
            </RevealOnScroll>
            <RevealOnScroll delay={130}>
              <Step n={2}>
                <RepoNode
                  name="TradingAgents-Funds-Runner"
                  href={`${GITHUB_BASE}/TradingAgents-Funds-Runner`}
                  role="Local Docker runner that executes TradingAgents-Funds for a configured watchlist of tickers and ISINs, converts each Markdown report to PDF, and uploads it to S3"
                />
              </Step>
            </RevealOnScroll>
            <RevealOnScroll delay={195}>
              <Connector label="uploads PDF reports to" />
            </RevealOnScroll>
            <RevealOnScroll delay={260}>
              <Step n={3}>
                <ExternalNode
                  name="AWS S3 Bucket"
                  role="Publicly accessible storage for the generated PDF reports"
                />
              </Step>
            </RevealOnScroll>
            <RevealOnScroll delay={325}>
              <Connector label="browsed via" />
            </RevealOnScroll>
            <RevealOnScroll delay={390}>
              <Step n={4}>
                <RepoNode
                  name="S3 Browser"
                  href={`${GITHUB_BASE}/S3-Browser-TradingAgents-Funds-Runner`}
                  role="GitHub Pages-hosted file browser configured to list and open the PDF reports stored in the S3 bucket"
                />
              </Step>
            </RevealOnScroll>
          </div>
        </div>

        {/* ── Right: Standalone tools ── */}
        <div className="glass rounded-3xl p-6 sm:p-8">
          <p className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" aria-hidden="true" />
            Standalone tools
          </p>
          <div className="flex flex-col gap-4">
            <RevealOnScroll delay={0}>
              <RepoNode
                name="Investment News Analysis AI"
                href={`${GITHUB_BASE}/Investment-News-Analysis-AI`}
                role="Web app and AWS serverless stack — news snippets are submitted via a GitHub Pages client, aggregated in S3, then a LangGraph Lambda agent runs daily to produce an AI-written investment analysis report"
              />
            </RevealOnScroll>
            <RevealOnScroll delay={130}>
              <RepoNode
                name="Investment Fund Reporting AI"
                href={`${GITHUB_BASE}/Investment-Fund-Reporting-AI`}
                role="Claude Code automation that maintains a Google Sheets workbook with fund-style financial statements (P&L, balance sheet, returns) for a Hargreaves Lansdown Stocks & Shares ISA"
              />
            </RevealOnScroll>
            <RevealOnScroll delay={260}>
              <RepoNode
                name="Turtle Quant 1"
                href={`${GITHUB_BASE}/Turtle-Quant-1`}
                role="Algorithmic equity trading assistant with modular technical and support/resistance indicators, backtesting, hyperparameter tuning, and long-running jobs orchestrated on Google Cloud Run"
              />
            </RevealOnScroll>
            <RevealOnScroll delay={390}>
              <RepoNode
                name="Market Regime Detector"
                href={`${GITHUB_BASE}/Market-Regime-Detector`}
                role="A macro-economic regime classification model based on the Bridgewater All Weather macro quadrants"
              />
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Numbered marker + node, so the pipeline order reads at a glance. */
function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span
        className="mt-3 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-mono text-sm text-gold shadow-[0_0_18px_-4px_rgba(231,196,126,0.6)]"
        aria-hidden="true"
      >
        {n}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

function RepoNode({ name, href, role }: { name: string; href: string; role: string }) {
  const onPointerMove = useSpotlight<HTMLAnchorElement>()
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={onPointerMove}
      className="glass spotlight group block rounded-2xl p-4"
    >
      <p className="flex items-center justify-between gap-2 text-sm font-semibold text-white transition-colors duration-200 group-hover:text-gold">
        {name}
        <svg
          viewBox="0 0 12 12"
          className="h-3 w-3 flex-shrink-0 -translate-x-1 text-gold opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 9l6-6M4 3h5v5" />
        </svg>
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{role}</p>
    </a>
  )
}

function ExternalNode({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] px-4 py-3.5">
      <svg
        viewBox="0 0 20 20"
        className="mt-0.5 h-5 w-5 flex-shrink-0 text-mint"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <ellipse cx="10" cy="5" rx="6.5" ry="2.5" />
        <path d="M3.5 5v10c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5V5M3.5 10c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5" />
      </svg>
      <div>
        <p className="text-sm font-semibold text-slate-100">{name}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">{role}</p>
      </div>
    </div>
  )
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex items-stretch gap-4 py-1 pl-[1.0625rem]">
      <div className="flow-line min-h-[3rem]" aria-hidden="true">
        <span className="flow-arrow" />
      </div>
      <span className="self-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-slate-300">
        {label}
      </span>
    </div>
  )
}
