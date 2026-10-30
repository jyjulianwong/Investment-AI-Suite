import { useEffect, useState, type ReactNode } from 'react'
import {
  BUY_VS_BUILD_AS_OF,
  BUY_VS_BUILD_FOOTNOTES,
  BUY_VS_BUILD_NOTES,
  BUY_VS_BUILD_PROJECTS,
  BUY_VS_BUILD_TOTAL_RANGE,
} from '../data/buyVsBuild'
import { prefersReducedMotion, useInView } from '../hooks/useInView'
import CostChart from './CostChart'
import RevealOnScroll from './RevealOnScroll'
import SectionHeading from './SectionHeading'

const gbp = (n: number) => `£${n.toLocaleString('en-GB')}`

export default function BuyVsBuild() {
  const projects = BUY_VS_BUILD_PROJECTS
  const saasTotal = projects.reduce((sum, p) => sum + p.estimateGbpPerYear, 0)
  const allActualsKnown = projects.every((p) => p.actualGbpPerYear !== null)
  const actualTotal = projects.reduce((sum, p) => sum + (p.actualGbpPerYear ?? 0), 0)

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading index="03" title="Why Build It Myself and Not Buy?">
        Estimated SaaS subscription cost to get roughly the same result without building it, as of{' '}
        <span className="text-gold">{BUY_VS_BUILD_AS_OF}</span>.
      </SectionHeading>

      {/* Headline totals */}
      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        <RevealOnScroll delay={0}>
          <Stat
            label="SaaS instead (central)"
            value={
              <>
                <CountUp to={saasTotal} />
                <span className="text-base text-slate-400">/yr</span>
              </>
            }
            sub={`≈ ${gbp(Math.round(saasTotal / 12))}/month`}
            accent
          />
        </RevealOnScroll>
        <RevealOnScroll delay={90}>
          <Stat
            label="SaaS instead (range)"
            value={
              <>
                {BUY_VS_BUILD_TOTAL_RANGE}
                <span className="text-base text-slate-400">/yr</span>
              </>
            }
            sub="low to high estimates"
          />
        </RevealOnScroll>
        <RevealOnScroll delay={180}>
          <Stat
            label="My actual AWS + Render + LLM"
            value={
              allActualsKnown ? (
                <>
                  <CountUp to={actualTotal} />
                  <span className="text-base text-slate-400">/yr</span>
                </>
              ) : actualTotal > 0 ? (
                <>
                  <CountUp to={actualTotal} />
                  <span className="text-base text-slate-400">/yr so far</span>
                </>
              ) : (
                'Not recorded yet'
              )
            }
            sub={allActualsKnown ? 'all projects filled in' : 'fill in data/buyVsBuild.ts'}
            tone="mint"
          />
        </RevealOnScroll>
      </div>

      <RevealOnScroll className="!h-auto">
        <CostChart projects={projects} />
      </RevealOnScroll>

      {/* Comparison table */}
      <RevealOnScroll className="!h-auto">
        <div className="glass mt-8 overflow-hidden rounded-3xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <caption className="sr-only">Closest SaaS alternative and yearly cost for each project</caption>
              <thead className="bg-white/[0.03] text-[11px] uppercase tracking-[0.18em] text-slate-300">
                <tr>
                  <th scope="col" className="px-5 py-4 font-semibold">Project</th>
                  <th scope="col" className="px-5 py-4 font-semibold">Closest SaaS</th>
                  <th scope="col" className="whitespace-nowrap px-5 py-4 text-right font-semibold">SaaS est./yr</th>
                  <th scope="col" className="whitespace-nowrap px-5 py-4 text-right font-semibold">My actual/yr</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.name} className="group border-t border-white/[0.07] align-top transition-colors duration-200 hover:bg-white/[0.035]">
                    <td className="max-w-[16rem] px-5 py-5">
                      <p className="font-serif text-base font-semibold text-white">{p.name}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{p.does}</p>
                    </td>
                    <td className="px-5 py-5 text-slate-300">
                      <ul className="space-y-2.5">
                        {p.saasOptions.map((o) => (
                          <li key={o.vendor}>
                            <span className="text-slate-100">{o.vendor}</span>{' '}
                            <span className="ml-1 whitespace-nowrap rounded-md bg-gold/10 px-1.5 py-0.5 font-mono text-xs text-gold">
                              {o.price}
                            </span>
                            {o.detail && <span className="mt-0.5 block text-xs text-slate-400">{o.detail}</span>}
                          </li>
                        ))}
                      </ul>
                      {p.caveats.length > 0 && (
                        <ul className="mt-3 space-y-1.5 border-l-2 border-amber-400/40 pl-3 text-xs text-amber-200/90">
                          {p.caveats.map((c) => (
                            <li key={c}>{c}</li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-5 text-right font-mono tabular-nums text-slate-100">
                      {gbp(p.estimateGbpPerYear)}
                      {p.range && <span className="block text-xs text-slate-400">{p.range}</span>}
                      <span className="ml-auto mt-2 block h-1 w-20 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                        <span
                          className="block h-full rounded-full bg-gradient-to-r from-gold-deep to-gold"
                          style={{ width: `${(p.estimateGbpPerYear / saasTotal) * 100}%` }}
                        />
                      </span>
                      <span className="sr-only">{Math.round((p.estimateGbpPerYear / saasTotal) * 100)}% of total</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-5 text-right font-mono tabular-nums text-slate-100">
                      {p.actualGbpPerYear === null ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        gbp(p.actualGbpPerYear)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gold/30 bg-gold/[0.06] font-semibold text-white">
                  <td className="px-5 py-4 font-serif text-base" colSpan={2}>Total</td>
                  <td className="px-5 py-4 text-right font-mono tabular-nums text-gold">{gbp(saasTotal)}</td>
                  <td className="px-5 py-4 text-right font-mono tabular-nums">
                    {actualTotal > 0 ? gbp(actualTotal) : <span className="text-slate-400">—</span>}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll className="!h-auto">
        <ul className="mt-8 max-w-3xl space-y-2 text-xs leading-relaxed text-slate-400">
          {[...BUY_VS_BUILD_NOTES, ...BUY_VS_BUILD_FOOTNOTES].map((n) => (
            <li key={n} className="flex gap-3">
              <span className="mt-[0.45rem] h-1 w-1 flex-shrink-0 rounded-full bg-gold/70" aria-hidden="true" />
              {n}
            </li>
          ))}
        </ul>
      </RevealOnScroll>
    </section>
  )
}

function Stat({
  label,
  value,
  sub,
  accent = false,
  tone,
}: {
  label: string
  value: ReactNode
  sub: string
  accent?: boolean
  tone?: 'mint'
}) {
  const valueColor = accent ? 'text-gold-gradient' : tone === 'mint' ? 'text-mint' : 'text-white'
  return (
    <div className={`glass h-full overflow-hidden rounded-2xl p-6 ${accent ? 'border-gold/30' : ''}`}>
      {accent && (
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/20 blur-3xl"
          aria-hidden="true"
        />
      )}
      <p className="relative text-[11px] uppercase tracking-[0.18em] text-slate-300">{label}</p>
      <p className={`relative mt-3 text-right font-serif text-3xl font-semibold lining-nums tabular-nums ${valueColor}`}>{value}</p>
      <p className="relative mt-1.5 text-xs text-slate-400">{sub}</p>
    </div>
  )
}

/** Counts up from £0 the first time it scrolls into view. */
function CountUp({ to }: { to: number }) {
  const [ref, inView] = useInView<HTMLSpanElement>()
  const [value, setValue] = useState(() => (prefersReducedMotion() ? to : 0))

  useEffect(() => {
    if (!inView || prefersReducedMotion()) {
      if (prefersReducedMotion()) setValue(to)
      return
    }
    const start = performance.now()
    const duration = 1500
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])

  return <span ref={ref}>{gbp(value)}</span>
}
