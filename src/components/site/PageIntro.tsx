import type { CSSProperties } from 'react'

import { Rosette } from '@/components/geometri/Rosette'

// Pembuka halaman dalam (Profil, Program, PSB, ...): judul serif besar dengan ornamen samar
export function PageIntro({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string | null
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#0b2418]/8">
      <div className="rosette-mask pointer-events-none absolute top-1/2 -right-48 -z-10 w-[640px] -translate-y-1/2 opacity-[0.18] md:-right-24">
        <Rosette className="h-auto w-full" />
      </div>
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-14 sm:px-10 md:pt-24 md:pb-20">
        <p className="intro text-xs font-semibold tracking-[0.35em] text-[#a6821c] uppercase">
          {eyebrow}
        </p>
        <h1
          className="intro mt-4 max-w-4xl font-serif text-[clamp(2.8rem,6vw,5.2rem)] leading-[0.98] font-semibold text-[#0b2418]"
          style={{ '--delay': '0.15s' } as CSSProperties}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="intro mt-6 max-w-2xl text-lg leading-relaxed text-[#0b2418]/65"
            style={{ '--delay': '0.3s' } as CSSProperties}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
