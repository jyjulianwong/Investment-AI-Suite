import {
  BUY_VS_BUILD_AS_OF,
  BUY_VS_BUILD_FOOTNOTES,
  BUY_VS_BUILD_NOTES,
  BUY_VS_BUILD_PROJECTS,
  BUY_VS_BUILD_TOTAL_RANGE,
} from '../data/buyVsBuild'
import RevealOnScroll from './RevealOnScroll'

const gbp = (n: number) => `£${n.toLocaleString('en-GB')}`

export default function BuyVsBuild() {
  const projects = BUY_VS_BUILD_PROJECTS
  const saasTotal = projects.reduce((sum, p) => sum + p.estimateGbpPerYear, 0)
  const allActualsKnown = projects.every((p) => p.actualGbpPerYear !== null)
  const actualTotal = projects.reduce((sum, p) => sum + (p.actualGbpPerYear ?? 0), 0)

  return (
    <section className="border-t border-surface-border py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="sticky top-0 z-10 -mx-6 mb-2 border-b border-surface-border bg-surface/90 px-6 py-4 text-sm font-semibold uppercase tracking-widest text-gray-500 backdrop-blur">
          Why Build It Myself and Not Buy?
        </h2>
        <p className="mb-6 mt-10 max-w-2xl text-sm leading-relaxed text-gray-400">
          Estimated SaaS subscription cost to get roughly the same result without building it, as of{' '}
          <span className="text-gray-300">{BUY_VS_BUILD_AS_OF}</span>.
        </p>

        {/* Headline totals */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Stat label="SaaS instead (central)" value={`${gbp(saasTotal)}/yr`} sub={`≈ ${gbp(Math.round(saasTotal / 12))}/month`} accent />
          <Stat label="SaaS instead (range)" value={`${BUY_VS_BUILD_TOTAL_RANGE}/yr`} sub="low to high estimates" />
          <Stat
            label="My actual AWS + Render + LLM"
            value={allActualsKnown ? `${gbp(actualTotal)}/yr` : actualTotal > 0 ? `${gbp(actualTotal)}/yr so far` : 'Not recorded yet'}
            sub={allActualsKnown ? 'all projects filled in' : 'fill in data/buyVsBuild.ts'}
          />
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto rounded-lg border border-surface-border bg-surface-card">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-surface-border text-xs uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Project</th>
                <th className="px-4 py-3 font-semibold">Closest SaaS</th>
                <th className="px-4 py-3 text-right font-semibold">SaaS est./yr</th>
                <th className="px-4 py-3 text-right font-semibold">My actual/yr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {projects.map((p) => (
                <tr key={p.name} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white">{p.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{p.does}</p>
                  </td>
                  <td className="px-4 py-4 text-gray-400">
                    <ul className="space-y-1">
                      {p.saasOptions.map((o) => (
                        <li key={o.vendor}>
                          <span className="text-gray-300">{o.vendor}</span>{' '}
                          <span className="font-mono text-xs text-accent">{o.price}</span>
                          {o.detail && <span className="block text-xs text-gray-500">{o.detail}</span>}
                        </li>
                      ))}
                    </ul>
                    {p.caveats.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-amber-400/80">
                        {p.caveats.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right font-mono text-gray-200">
                    {gbp(p.estimateGbpPerYear)}
                    {p.range && <span className="block text-xs text-gray-500">{p.range}</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right font-mono text-gray-200">
                    {p.actualGbpPerYear === null ? <span className="text-gray-600">—</span> : gbp(p.actualGbpPerYear)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-surface-border">
              <tr className="font-semibold text-white">
                <td className="px-4 py-3" colSpan={2}>Total</td>
                <td className="px-4 py-3 text-right font-mono text-accent">{gbp(saasTotal)}</td>
                <td className="px-4 py-3 text-right font-mono">{actualTotal > 0 ? gbp(actualTotal) : <span className="text-gray-600">—</span>}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <RevealOnScroll>
          <ul className="mt-6 space-y-1 text-xs leading-relaxed text-gray-500">
            {[...BUY_VS_BUILD_NOTES, ...BUY_VS_BUILD_FOOTNOTES].map((n) => (
              <li key={n}>• {n}</li>
            ))}
          </ul>
        </RevealOnScroll>
      </div>
    </section>
  )
}

function Stat({ label, value, sub, accent = false }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card p-5">
      <p className="text-xs uppercase tracking-widest text-gray-500">{label}</p>
      <p className={`mt-2 font-mono text-xl font-semibold ${accent ? 'text-accent' : 'text-white'}`}>{value}</p>
      <p className="mt-1 text-xs text-gray-500">{sub}</p>
    </div>
  )
}
