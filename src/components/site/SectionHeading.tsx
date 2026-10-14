import type { ReactNode } from 'react'

export function SectionHeading({
  eyebrow,
  title,
  action,
  dark = false,
}: {
  eyebrow: string
  title: string
  action?: ReactNode
  dark?: boolean
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div data-reveal>
        <p
          className={`text-xs font-semibold tracking-[0.35em] uppercase ${dark ? 'text-[#e1bb4c]' : 'text-[#a6821c]'}`}
        >
          {eyebrow}
        </p>
        <h2
          className={`mt-3 font-serif text-4xl leading-tight font-semibold md:text-5xl ${dark ? 'text-[#f4efe1]' : 'text-[#0b2418]'}`}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}
