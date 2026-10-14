import type { Metadata } from 'next'

import { Rosette } from '@/components/geometri/Rosette'
import { ArchPhoto } from '@/components/site/ArchPhoto'
import { PageIntro } from '@/components/site/PageIntro'
import { SectionHeading } from '@/components/site/SectionHeading'
import { mediaUrl } from '@/lib/format'
import { getGallery, getProgramPage } from '@/lib/payload'

export const metadata: Metadata = {
  alternates: { canonical: '/program' },
  title: 'Program Pendidikan',
  description: 'Jenjang pendidikan, kegiatan harian, dan ekstrakurikuler santri.',
}

export default async function ProgramPage() {
  const [program, gallery] = await Promise.all([getProgramPage(), getGallery()])
  const photo = (i: number) =>
    gallery.length ? mediaUrl(gallery[i % gallery.length].image, 'large') : undefined

  return (
    <>
      <PageIntro
        eyebrow="Pendidikan"
        title="Program Pendidikan"
        subtitle="Jenjang pendidikan formal dan kepesantrenan, kegiatan harian santri, serta ekstrakurikuler."
      />

      {program.levels && program.levels.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 md:py-32">
          <SectionHeading eyebrow="Jenjang & program" title="Pilihan pendidikan" />
          <div className="grid gap-10 md:grid-cols-3">
            {program.levels.map((level, i) => (
              <div key={level.id ?? i} data-reveal>
                <ArchPhoto src={photo(i)} alt={level.name} className="aspect-[4/5]" />
                <div className="mt-6">
                  {level.label && (
                    <span className="text-xs font-semibold tracking-[0.2em] text-[#a6821c] uppercase">
                      {level.label}
                    </span>
                  )}
                  <h3 className="mt-2 font-serif text-3xl font-semibold">{level.name}</h3>
                  {level.description && (
                    <p className="mt-2 leading-relaxed text-[#0b2418]/65">{level.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {program.dailySchedule && program.dailySchedule.length > 0 && (
        <section className="relative isolate overflow-hidden bg-[#0b2418] text-[#f4efe1]">
          <div className="rosette-mask pointer-events-none absolute -right-40 -bottom-40 -z-10 w-[720px] opacity-20">
            <Rosette className="h-auto w-full" />
          </div>
          <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 sm:px-10 md:py-32 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="Kehidupan santri" title="Sehari di Pondok" dark />
              <p data-reveal className="-mt-4 leading-relaxed text-[#f4efe1]/65">
                Dari tahajud dan subuh berjamaah hingga belajar malam di asrama, setiap waktu santri
                terisi dengan ibadah, mengaji, belajar, dan pembinaan akhlak.
              </p>
            </div>
            <ol className="grid gap-1 lg:col-span-8 lg:grid-cols-2 lg:gap-x-10">
              {program.dailySchedule.map((item, i) => (
                <li
                  key={item.id ?? i}
                  data-reveal
                  className="flex items-baseline gap-5 border-b border-[#f4efe1]/10 py-4"
                >
                  <span className="w-16 shrink-0 font-serif text-2xl text-[#e1bb4c] tabular-nums">
                    {item.time}
                  </span>
                  <span className="text-[#f4efe1]/85">{item.activity}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {program.extracurriculars && program.extracurriculars.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 md:py-32">
          <SectionHeading eyebrow="Pengembangan diri" title="Ekstrakurikuler" />
          <div className="flex flex-wrap gap-3">
            {program.extracurriculars.map((activity, i) => (
              <span
                key={activity.id ?? i}
                data-reveal
                className="rounded-full border border-[#0b2418]/15 bg-white/60 px-6 py-3 font-serif text-2xl"
              >
                {activity.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
