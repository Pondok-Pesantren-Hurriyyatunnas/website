type Props = { title: string; subtitle?: string | null; eyebrow?: string }

// Kepala halaman berupa kartu hijau gelap bermotif (gaya bento)
export function PageHeader({ title, subtitle, eyebrow }: Props) {
  return (
    <section className="px-3 pt-4 sm:px-4">
      <div className="pattern-green relative mx-auto max-w-6xl overflow-hidden rounded-[32px] px-6 py-14 text-white sm:px-12 md:py-20">
        <div className="pointer-events-none absolute -right-20 -bottom-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgb(225_187_76/0.28),transparent_70%)]" />
        {eyebrow && (
          <p className="text-sm font-semibold tracking-[0.15em] text-gold-400 uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-brand-100/85">{subtitle}</p>}
      </div>
    </section>
  )
}
