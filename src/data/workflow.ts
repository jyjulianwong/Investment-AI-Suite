const GITHUB_BASE = 'https://github.com/jyjulianwong'

/** Side of a node a connection attaches to. */
export type Side = 'l' | 'r' | 't' | 'b'

export interface WorkflowNodeSpec {
  id: string
  name: string
  /** Short category chip shown above the name. */
  tag: string
  role: string
  /** Omit for non-repo (external) nodes. */
  href?: string
  /** Top-left position per layout. */
  wide: { x: number; y: number }
  narrow: { x: number; y: number }
}

export interface WorkflowEdgeSpec {
  id: string
  source: string
  target: string
  label: string
  wide: { from: Side; to: Side }
  narrow: { from: Side; to: Side; /** Route around intervening nodes with a bracket-shaped step path. */ bypass?: boolean }
}

/** Fixed node width in graph units; layouts below are designed around it. */
export const NODE_WIDTH = 260

/**
 * Wide layout (desktop):
 *
 *            [ News Analysis ]
 *   [ Regime ] ─────────────── [ TradingAgents-Funds ]
 *                                        │
 *   [ S3 Browser ] ◄ [ S3 ] ◄ [ Runner ] ◄
 *
 * Narrow layout (mobile) is a single column with the Regime → TradingAgents-Funds
 * edge bypassing the News node on its left.
 */
export const WORKFLOW_NODES: WorkflowNodeSpec[] = [
  {
    id: 'regime',
    name: 'Market Regime Detector',
    tag: 'Macro signal',
    href: `${GITHUB_BASE}/Market-Regime-Detector`,
    role: 'A macro-economic regime classification model based on the Bridgewater All Weather macro quadrants',
    wide: { x: 0, y: 230 },
    narrow: { x: 0, y: 0 },
  },
  {
    id: 'news',
    name: 'Investment News Analysis AI',
    tag: 'News signal',
    href: `${GITHUB_BASE}/Investment-News-Analysis-AI`,
    role: 'Web app and AWS serverless stack — news snippets are aggregated in S3, then a LangGraph Lambda agent runs daily to produce an AI-written investment analysis report',
    wide: { x: 400, y: 0 },
    narrow: { x: 0, y: 235 },
  },
  {
    id: 'agents',
    name: 'TradingAgents-Funds',
    tag: 'Core agents',
    href: `${GITHUB_BASE}/TradingAgents-Funds`,
    role: 'Fork of the open-source TradingAgents framework, extended to support fund ISINs by mapping them to representative proxy equity holdings',
    wide: { x: 800, y: 230 },
    narrow: { x: 0, y: 490 },
  },
  {
    id: 'runner',
    name: 'TradingAgents-Funds-Runner',
    tag: 'Runner',
    href: `${GITHUB_BASE}/TradingAgents-Funds-Runner`,
    role: 'Local Docker runner that executes TradingAgents-Funds for a watchlist of tickers and ISINs, converts each Markdown report to PDF, and uploads it to S3',
    wide: { x: 800, y: 500 },
    narrow: { x: 0, y: 745 },
  },
  {
    id: 's3',
    name: 'AWS S3 Bucket',
    tag: 'Storage',
    role: 'Publicly accessible storage for the generated PDF reports',
    wide: { x: 400, y: 500 },
    narrow: { x: 0, y: 1000 },
  },
  {
    id: 'browser',
    name: 'S3 Browser',
    tag: 'Viewer',
    href: `${GITHUB_BASE}/S3-Browser-TradingAgents-Funds-Runner`,
    role: 'GitHub Pages-hosted file browser configured to list and open the PDF reports stored in the S3 bucket',
    wide: { x: 0, y: 500 },
    narrow: { x: 0, y: 1200 },
  },
]

export const WORKFLOW_EDGES: WorkflowEdgeSpec[] = [
  {
    id: 'regime-news',
    source: 'regime',
    target: 'news',
    label: 'regime feeds',
    wide: { from: 'r', to: 'l' },
    narrow: { from: 'b', to: 't' },
  },
  {
    id: 'regime-agents',
    source: 'regime',
    target: 'agents',
    label: 'regime context',
    wide: { from: 'r', to: 'l' },
    narrow: { from: 'l', to: 'l', bypass: true },
  },
  {
    id: 'news-agents',
    source: 'news',
    target: 'agents',
    label: 'news analysis',
    wide: { from: 'r', to: 'l' },
    narrow: { from: 'b', to: 't' },
  },
  {
    id: 'agents-runner',
    source: 'agents',
    target: 'runner',
    label: 'imported by',
    wide: { from: 'b', to: 't' },
    narrow: { from: 'b', to: 't' },
  },
  {
    id: 'runner-s3',
    source: 'runner',
    target: 's3',
    label: 'uploads PDFs',
    wide: { from: 'l', to: 'r' },
    narrow: { from: 'b', to: 't' },
  },
  {
    id: 's3-browser',
    source: 's3',
    target: 'browser',
    label: 'browsed via',
    wide: { from: 'l', to: 'r' },
    narrow: { from: 'b', to: 't' },
  },
]

export interface StandaloneTool {
  name: string
  href: string
  role: string
}

/** Tools with no data flowing to or from the rest of the suite. */
export const STANDALONE_TOOLS: StandaloneTool[] = [
  {
    name: 'Investment Fund Reporting AI',
    href: `${GITHUB_BASE}/Investment-Fund-Reporting-AI`,
    role: 'Claude Code automation that maintains a Google Sheets workbook with fund-style financial statements (P&L, balance sheet, returns) for a Hargreaves Lansdown Stocks & Shares ISA',
  },
  {
    name: 'Turtle Quant 1',
    href: `${GITHUB_BASE}/Turtle-Quant-1`,
    role: 'Algorithmic equity trading assistant with modular technical and support/resistance indicators, backtesting, hyperparameter tuning, and long-running jobs orchestrated on Google Cloud Run',
  },
]
