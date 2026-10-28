/**
 * Data for the "Why Build It Myself and Not Buy?" section.
 * Edit prices, notes and actual costs here; the section re-renders from this file.
 * Costs are per year (£). Set `actualGbpPerYear` to a number once real AWS / Render / LLM bills are known.
 */

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
  /** My real running cost (AWS, Render, LLM) in £/yr. null = not recorded yet. */
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
    actualGbpPerYear: null,
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
    actualGbpPerYear: null,
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
    actualGbpPerYear: null,
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
    actualGbpPerYear: null,
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
    actualGbpPerYear: null,
  },
]

/** Overall range shown beside the computed central total. */
export const BUY_VS_BUILD_TOTAL_RANGE = '£950–1,600'

export const BUY_VS_BUILD_FOOTNOTES = [
  'Excludes the extra LLM spend for the TradingAgents runs, since SaaS wouldn\'t replicate that depth.',
  'Next step: compare against actual AWS, Render and LLM bills.',
]
