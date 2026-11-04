/**
 * Data for the "Why Build It Myself and Not Buy?" section.
 * Edit prices, notes and actual costs here; the section re-renders from this file.
 * Costs are per year (£). `actualGbpPerYear` is derived from the raw bills below.
 */

/* ---------------------------------------------------------------------------
 * SOURCE RECORD: my real running costs (raw figures as supplied)
 *
 * Infrastructure, updated 2026-10-31 (USD / month):
 *   AWS ECR: 0.05  - shared by Investment News Analysis AI, Market Regime Detector
 *   AWS S3:  0.04  - shared by Investment News Analysis AI, Market Regime Detector,
 *                    S3 for TradingAgents
 * LLM, updated 2026-09-30 (USD / month):
 *   TradingAgents: 7.68
 *   Investment News Analysis AI: 1.99
 * Render (API serving platform): costs nothing, so it is excluded everywhere.
 * Dev costs: Claude Code GBP 15.00 / month (not project-specific).
 *
 * Method: split each shared resource equally between the projects using it,
 * add each project's own LLM cost, multiply by 12, convert USD -> GBP at
 * USD_TO_GBP, and round to whole pounds. Fund Reporting AI and Turtle
 * Quant 1 have no running costs (set to 0). Claude Code is added to the totals.
 * ------------------------------------------------------------------------- */

/** Assumed rough exchange rate; not checked against live rates. Edit as needed. */
const USD_TO_GBP = 0.75

const AWS_ECR_USD_PM = 0.05
const AWS_S3_USD_PM = 0.04
const LLM_TRADINGAGENTS_USD_PM = 7.68
const LLM_NEWS_USD_PM = 1.99

/** Dev tooling (Claude Code), GBP per month. Counted in the headline and table totals. */
const CLAUDE_CODE_GBP_PM = 15

/** Yearly dev tooling cost in £, added on top of the per-project actuals. */
export const BUY_VS_BUILD_DEV_GBP_PER_YEAR = CLAUDE_CODE_GBP_PM * 12

const usdPmToGbpPy = (usdPerMonth: number) => Math.round(usdPerMonth * 12 * USD_TO_GBP)

// Per project, USD/month:
const NEWS_USD_PM = AWS_ECR_USD_PM / 2 + AWS_S3_USD_PM / 3 + LLM_NEWS_USD_PM // ≈ 2.03
const TRADINGAGENTS_USD_PM = AWS_S3_USD_PM / 3 + LLM_TRADINGAGENTS_USD_PM // ≈ 7.69
const REGIME_USD_PM = AWS_ECR_USD_PM / 2 + AWS_S3_USD_PM / 3 // ≈ 0.04

export const BUY_VS_BUILD_AS_OF = 'October 2026'

export const BUY_VS_BUILD_NOTES = [
  'Prices are in the currencies the vendors list; £ conversions are rough and not checked against today\'s exchange rates.',
  'Annual billing is assumed, which saves roughly 15% against monthly.',
]

export interface SaasOption {
  vendor: string
  /** Price as the vendor lists it, e.g. "$29.95/mo" */
  price: string
  detail?: string
}

export interface BuyVsBuildProject {
  name: string
  does: string
  saasOptions: SaasOption[]
  /** Central yearly SaaS estimate in £ */
  estimateGbpPerYear: number
  /** Optional display range, e.g. "£72–168" */
  range?: string
  caveats: string[]
  /** My real running cost (AWS, LLM) in £/yr. null = not recorded yet. */
  actualGbpPerYear: number | null
}

export const BUY_VS_BUILD_PROJECTS: BuyVsBuildProject[] = [
  {
    name: 'Investment News Analysis AI',
    does: 'Daily news snippets and newsletters become an AI-written report.',
    saasOptions: [
      { vendor: 'n8n Cloud (Starter)', price: '€20/mo', detail: '2,500 executions; a weekday run is ~22/mo. Covers IMAP newsletter pickup and a snippet form.' },
      { vendor: 'Tavily (free tier)', price: '£0', detail: '1,000 credits/mo, should cover search needs.' },
      { vendor: 'LLM API', price: '£2–5/mo', detail: 'My own estimate, not a looked-up price.' },
    ],
    estimateGbpPerYear: 250,
    caveats: [],
    actualGbpPerYear: usdPmToGbpPy(NEWS_USD_PM),
  },
  {
    name: 'TradingAgents-Funds + Runner + S3 Browser',
    does: 'Per-fund AI reports for a watchlist, hosted as PDFs.',
    saasOptions: [
      { vendor: 'Seeking Alpha Premium', price: '$299/yr', detail: '~$25/mo.' },
      { vendor: 'Google Drive (PDF hosting)', price: '£0' },
    ],
    estimateGbpPerYear: 230,
    caveats: [
      'No SaaS does multi-agent reports on UK fund ISINs.',
      'Seeking Alpha is US-centric, so likely covers UK OEICs poorly.',
    ],
    actualGbpPerYear: usdPmToGbpPy(TRADINGAGENTS_USD_PM),
  },
  {
    name: 'Investment Fund Reporting AI',
    does: 'Google Sheets workbook with fund-style statements for an HL Stocks & Shares ISA.',
    saasOptions: [
      { vendor: 'Sharesight Starter', price: '£6/mo', detail: '30 holdings.' },
      { vendor: 'Sharesight Investor', price: '£14/mo', detail: 'Unlimited holdings, advanced reporting.' },
    ],
    estimateGbpPerYear: 120,
    range: '£72–168',
    caveats: ['Gives performance, dividend and valuation reports, but probably not the exact P&L and balance sheet layout.'],
    actualGbpPerYear: 0,
  },
  {
    name: 'Turtle Quant 1',
    does: 'Technical indicators, support/resistance, backtesting and alerts.',
    saasOptions: [
      { vendor: 'TradingView Essential', price: '$12.95/mo', detail: '20 alerts.' },
      { vendor: 'TradingView Plus (assumed)', price: '$29.95/mo', detail: '100 alerts.' },
      { vendor: 'TradingView Premium', price: '$59.95/mo', detail: '400 alerts.' },
    ],
    estimateGbpPerYear: 280,
    range: '£120–575',
    caveats: ['Hyperparameter tuning and Cloud Run jobs have no SaaS equivalent.'],
    actualGbpPerYear: 0,
  },
  {
    name: 'Market Regime Detector',
    does: 'All Weather growth × inflation quadrants.',
    saasOptions: [
      { vendor: 'Hedgeye Macro Core', price: '$499/yr', detail: 'Promo price vs $1,198 list; includes GIP model and Quads map.' },
      { vendor: 'Hedgeye Early Look only', price: '$29.95/mo', detail: '~£270/yr.' },
    ],
    estimateGbpPerYear: 375,
    range: '~£270 (Early Look only)–375',
    caveats: ['Their quads are their own US-focused view, not a nowcast model you control.'],
    actualGbpPerYear: usdPmToGbpPy(REGIME_USD_PM),
  },
]

/** Overall range shown beside the computed central total. */
export const BUY_VS_BUILD_TOTAL_RANGE = '£950–1,600'

export const BUY_VS_BUILD_FOOTNOTES = [
  'Excludes the extra LLM spend for the TradingAgents runs, since SaaS wouldn\'t replicate that depth.',
  'My actual costs: AWS as of 31 Oct 2026, LLM as of 30 Sep 2026; USD converted at a rough $1 = £0.75. Shared AWS resources (ECR, S3) are split equally between the projects using them.',
  'Render hosts the API for free, so it adds nothing. Fund Reporting AI and Turtle Quant 1 have no running costs.',
  `The actual total includes Claude Code for development, £${CLAUDE_CODE_GBP_PM}/month (£${BUY_VS_BUILD_DEV_GBP_PER_YEAR}/yr).`,
]
