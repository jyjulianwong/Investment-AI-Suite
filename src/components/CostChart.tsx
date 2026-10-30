import type { BuyVsBuildProject } from '../data/buyVsBuild'
import { useInView } from '../hooks/useInView'

const gbp = (n: number) => `£${n.toLocaleString('en-GB')}`

/** Round `raw` up to a 1/2/5 × 10^k step so axis ticks land on friendly numbers. */
function niceStep(raw: number) {
  const pow = 10 ** Math.floor(Math.log10(raw))
  const n = raw / pow
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow
}

export default function CostChart({ projects }: { projects: BuyVsBuildProject[] }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.2)

  const peak = Math.max(...projects.map((p) => Math.max(p.estimateGbpPerYear, p.actualGbpPerYear ?? 0)))
  const step = niceStep(peak / 4)
  const axisMax = step * 4
  const ticks = [0, 1, 2, 3, 4].map((i) => step * i)

  const summary = projects
    .map(
      (p) =>
        `${p.name}: SaaS ${gbp(p.estimateGbpPerYear)} per year, actual ${p.actualGbpPerYear === null ? 'not recorded yet' : `${gbp(p.actualGbpPerYear)} per year`}`,
    )
    .join('. ')

  return (
    <div ref={ref} className="glass rounded-3xl p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="font-serif text-xl text-white">Yearly cost by project</p>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-300">
          <Legend swatch="bg-gradient-to-r from-gold-deep to-gold" label="SaaS estimate" />
          <Legend swatch="bg-gradient-to-r from-mint-deep to-mint" label="My actual" />
          <Legend swatch="border border-dashed border-white/40" label="Not recorded yet" />
        </ul>
      </div>

      <div role="img" aria-label={summary}>
        {projects.map((p, i) => (
          <div key={p.name} className="grid items-stretch gap-x-6 md:grid-cols-[15rem_1fr]">
            <p className="self-end pt-3 text-sm font-medium text-white md:self-center md:pt-0">{p.name}</p>
            <div className="plot-grid relative mr-16 space-y-1.5 py-3.5">
              <Bar value={p.estimateGbpPerYear} max={axisMax} tone="gold" inView={inView} delay={i * 110} />
              <Bar value={p.actualGbpPerYear} max={axisMax} tone="mint" inView={inView} delay={i * 110 + 70} />
            </div>
          </div>
        ))}

        <div className="grid gap-x-6 md:grid-cols-[15rem_1fr]" aria-hidden="true">
          <span className="hidden md:block" />
          <div className="relative mr-16 h-6">
            {ticks.map((t, i) => (
              <span
                key={t}
                className="absolute top-1 font-mono text-[11px] text-slate-400"
                style={{ left: `${i * 25}%`, transform: 'translateX(-50%)' }}
              >
                {gbp(t)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`inline-block h-2.5 w-5 rounded-full ${swatch}`} aria-hidden="true" />
      {label}
    </li>
  )
}

function Bar({
  value,
  max,
  tone,
  inView,
  delay,
}: {
  value: number | null
  max: number
  tone: 'gold' | 'mint'
  inView: boolean
  delay: number
}) {
  if (value === null) {
    return (
      <div className="flex h-3.5 items-center" aria-hidden="true">
        <span className="h-2 w-24 rounded-r-full border border-dashed border-white/30" />
      </div>
    )
  }

  const fill =
    tone === 'gold'
      ? 'bg-gradient-to-r from-gold-deep to-gold shadow-[0_0_16px_-2px_rgba(231,196,126,0.55)]'
      : 'bg-gradient-to-r from-mint-deep to-mint shadow-[0_0_16px_-2px_rgba(92,225,198,0.5)]'

  return (
    <div className="relative h-3.5" style={{ width: `${(value / max) * 100}%` }}>
      <div
        className={`bar-grow h-full w-full rounded-r-full ${fill}`}
        style={{ transform: inView ? 'scaleX(1)' : 'scaleX(0)', transitionDelay: `${delay}ms` }}
      />
      <span
        className={`absolute left-full top-1/2 ml-2 -translate-y-1/2 font-mono text-xs transition-opacity duration-700 ${tone === 'gold' ? 'text-gold' : 'text-mint'} ${inView ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: `${delay + 500}ms` }}
      >
        {gbp(value)}
      </span>
    </div>
  )
}
