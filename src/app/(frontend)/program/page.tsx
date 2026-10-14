import type { Metadata } from 'next'

import { PageHeader } from '@/components/PageHeader'
import { getProgramPage } from '@/lib/payload'

export const metadata: Metadata = {
  alternates: { canonical: '/program' },
  title: 'Program Pendidikan',
  description: 'Jenjang pendidikan, kegiatan harian, dan ekstrakurikuler santri.',
}

export default async function ProgramPage() {
  const program = await getProgramPage()

  return (
    <>
      <PageHeader
        eyebrow="Pendidikan"
        title="Program Pendidikan"
        subtitle="Jenjang pendidikan, kegiatan harian, dan ekstrakurikuler santri."
      />

      <div className="mx-auto max-w-[74rem] space-y-3.5 px-3 pt-3.5 pb-16 sm:px-4">
        {program.levels && program.levels.length > 0 && (
          <section className="grid gap-3.5 md:grid-cols-3">
            {program.levels.map((level, i) => (
              <div
                key={level.id ?? i}
                className={`flex flex-col rounded-[28px] p-7 ${i === 0 ? 'bg-gradient-to-br from-brand-700 to-brand-950 text-white' : 'card-bento'}`}
              >
                {level.label && (
                  <span
                    className={`self-start rounded-full px-3 py-1 text-xs font-bold ${i === 0 ? 'bg-white/10 text-gold-300' : 'bg-gold-300/30 text-gold-600'}`}
                  >
                    {level.label}
                  </span>
                )}
                <h2
                  className={`mt-10 text-2xl font-bold tracking-tight ${i === 0 ? 'text-white' : 'text-brand-950'}`}
                >
                  {level.name}
                </h2>
                {level.description && (
                  <p
                    className={`mt-2 text-sm leading-relaxed ${i === 0 ? 'text-brand-100/80' : 'text-slate-600'}`}
                  >
                    {level.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        <section className="grid gap-3.5 lg:grid-cols-12">
          {program.dailySchedule && program.dailySchedule.length > 0 && (
            <div className="card-bento p-7 md:p-9 lg:col-span-7">
              <p className="text-sm font-semibold tracking-[0.15em] text-gold-600 uppercase">
                Sehari di pondok
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-brand-950">
                Kegiatan Harian Santri
              </h2>
              <ol className="relative mt-7 space-y-1 before:absolute before:top-3 before:bottom-3 before:left-[38px] before:w-px before:bg-brand-100">
                {program.dailySchedule.map((item, i) => (
                  <li
                    key={item.id ?? i}
                    className="relative flex items-center gap-4 rounded-2xl p-2 transition hover:bg-paper"
                  >
                    <span className="z-10 w-[62px] shrink-0 rounded-full bg-brand-50 py-1 text-center text-sm font-bold text-brand-700 tabular-nums">
                      {item.time}
                    </span>
                    <span className="text-slate-700">{item.activity}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {program.extracurriculars && program.extracurriculars.length > 0 && (
            <div className="rings flex flex-col rounded-[28px] p-7 text-white md:p-9 lg:col-span-5">
              <p className="text-sm font-semibold tracking-[0.15em] text-gold-400 uppercase">
                Pengembangan diri
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">Ekstrakurikuler</h2>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {program.extracurriculars.map((activity, i) => (
                  <span
                    key={activity.id ?? i}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold backdrop-blur"
                  >
                    {activity.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
