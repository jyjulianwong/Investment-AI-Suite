// Decorative price line behind the hero: deterministic so SSR/hydration and screenshots match.
const W = 1200
const H = 420
const POINTS: [number, number][] = (() => {
  let seed = 11
  const rnd = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const n = 36
  return Array.from({ length: n }, (_, i) => {
    const trend = 0.78 - 0.5 * (i / (n - 1))
    const noise = (rnd() - 0.5) * 0.16
    return [(i / (n - 1)) * W, Math.min(0.95, Math.max(0.12, trend + noise)) * H] as [number, number]
  })
})()

const LINE = (() => {
  let d = `M${POINTS[0][0]},${POINTS[0][1]}`
  for (let i = 1; i < POINTS.length - 1; i++) {
    const [x, y] = POINTS[i]
    const [nx, ny] = POINTS[i + 1]
    d += ` Q${x},${y} ${(x + nx) / 2},${(y + ny) / 2}`
  }
  const last = POINTS[POINTS.length - 1]
  return `${d} L${last[0]},${last[1]}`
})()

const AREA = `${LINE} L${W},${H} L0,${H} Z`

export default function Header() {
  return (
    <header className="relative isolate overflow-hidden px-6 pb-32 pt-24 text-center sm:pb-40 sm:pt-32">
      <HeroChart />

      <div className="relative mx-auto max-w-3xl">
        <span className="hero-rise glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 font-mono text-xs tracking-wide text-gold">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          AI-powered investing
        </span>

        <h1
          className="hero-rise mt-8 font-serif text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
          style={{ animationDelay: '120ms' }}
        >
          <span className="text-ivory-gradient">Investment </span>
          <em className="text-gold-gradient pr-1 font-medium">AI</em>
          <span className="text-ivory-gradient"> Suite</span>
        </h1>

        <p
          className="hero-rise mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-slate-300"
          style={{ animationDelay: '240ms' }}
        >
          A collection of AI-powered tools for automating personal investment research, fund management, and reporting
          workflows.
        </p>

        <a
          href="https://github.com/jyjulianwong"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-rise glass mt-9 inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm text-slate-200 transition-colors duration-200 hover:border-gold/40 hover:text-gold"
          style={{ animationDelay: '360ms' }}
        >
          <GitHubIcon />
          jyjulianwong
        </a>
      </div>
    </header>
  )
}

function HeroChart() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[22rem] w-full opacity-70 [mask-image:linear-gradient(to_top,#000_35%,transparent)] [-webkit-mask-image:linear-gradient(to_top,#000_35%,transparent)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-stroke" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#5ce1c6" stopOpacity="0" />
          <stop offset="0.35" stopColor="#5ce1c6" stopOpacity="0.8" />
          <stop offset="1" stopColor="#e7c47e" />
        </linearGradient>
        <linearGradient id="hero-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e7c47e" stopOpacity="0.22" />
          <stop offset="1" stopColor="#e7c47e" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="white" strokeOpacity="0.06" strokeDasharray="2 8" />
      ))}
      <path d={AREA} fill="url(#hero-fill)" className="fade-area" />
      <path
        d={LINE}
        pathLength={1}
        fill="none"
        stroke="url(#hero-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="draw-line"
      />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}
