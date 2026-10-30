import type { ReactNode } from 'react'
import RevealOnScroll from './RevealOnScroll'

interface SectionHeadingProps {
  index: string
  title: string
  children?: ReactNode
}

export default function SectionHeading({ index, title, children }: SectionHeadingProps) {
  return (
    <RevealOnScroll className="!h-auto">
      <div className="mb-12 max-w-2xl">
        <p className="flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-gold" aria-hidden="true">
          {index}
          <span className="h-px w-12 bg-gradient-to-r from-gold/70 to-transparent" />
        </p>
        <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
        {children && <p className="mt-4 text-base leading-relaxed text-slate-300">{children}</p>}
      </div>
    </RevealOnScroll>
  )
}
