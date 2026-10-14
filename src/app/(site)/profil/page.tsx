import type { Metadata } from 'next'

import { Rosette } from '@/components/geometri/Rosette'
import { RichText } from '@/components/RichText'
import { ArchPhoto } from '@/components/site/ArchPhoto'
import { PageIntro } from '@/components/site/PageIntro'
import { SectionHeading } from '@/components/site/SectionHeading'
import { mediaUrl } from '@/lib/format'
import { getGallery, getHomePage, getProfilePage, getSiteSettings } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings()
  return {
    title: 'Profil',
    description: `Sejarah, visi misi, dan struktur pengurus ${site.name}.`,
    alternates: { canonical: '/profil' },
  }
}

export default async function ProfilePage() {
  const [site, profile, home, gallery] = await Promise.all([
    getSiteSettings(),
    getProfilePage(),
    getHomePage(),
    getGallery(),
  ])
  const historyPhoto = mediaUrl(home.heroImage, 'large') ?? mediaUrl(gallery[0]?.image, 'large')

  return (
    <>
      <PageIntro
        eyebrow="Tentang kami"
        title="Profil Pondok"
        subtitle={`Mengenal lebih dekat ${site.name}: perjalanan, cita-cita, dan orang-orang di baliknya.`}
      />

      {/* Sejarah */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 sm:px-10 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5" data-reveal>
          <ArchPhoto src={historyPhoto} alt={site.name} className="mx-auto aspect-[4/5] max-w-md" />
        </div>
        <div className="lg:col-span-7">
          <SectionHeading eyebrow="Sejarah singkat" title="Perjalanan pondok" />
          {site.foundedYear && (
            <p data-reveal className="-mt-4 mb-8 flex items-baseline gap-3">
              <span className="font-serif text-6xl font-semibold text-[#1f7f4a]">
                {site.foundedYear}
              </span>
              <span className="text-sm tracking-wide text-[#0b2418]/55">tahun berdiri</span>
            </p>
          )}
          <div data-reveal className="text-lg">
            {profile.history ? (
              <RichText data={profile.history} />
            ) : (
              <p className="text-[#0b2418]/55">Sejarah pondok belum diisi.</p>
            )}
          </div>
        </div>
      </section>

      {/* Visi */}
      <section className="relative isolate overflow-hidden bg-[#0b2418] text-[#f4efe1]">
        <div className="rosette-mask pointer-events-none absolute top-1/2 left-1/2 -z-10 w-[820px] -translate-x-1/2 -translate-y-1/2 opacity-[0.16]">
          <Rosette className="h-auto w-full" />
        </div>
        <div className="mx-auto max-w-4xl px-6 py-28 text-center sm:px-10 md:py-36">
          <p
            data-reveal
            className="text-xs font-semibold tracking-[0.35em] text-[#e1bb4c] uppercase"
          >
            Visi
          </p>
          <p
            data-reveal
            className="mt-8 font-serif text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.15] font-medium"
          >
            {profile.vision ? `“${profile.vision}”` : 'Visi belum diisi.'}
          </p>
        </div>
      </section>

      {/* Misi */}
      {profile.missions && profile.missions.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 md:py-32">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="Misi" title="Langkah kami" />
            </div>
            <ol className="lg:col-span-8">
              {profile.missions.map((mission, i) => (
                <li
                  key={mission.id ?? i}
                  data-reveal
                  className="flex gap-8 border-b border-[#0b2418]/10 py-7 first:border-t"
                >
                  <span className="font-serif text-4xl font-semibold text-[#e1bb4c]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="pt-2 text-lg leading-relaxed">{mission.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Pengurus */}
      {profile.staff && profile.staff.length > 0 && (
        <section className="border-t border-[#0b2418]/10 bg-white/50">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10 md:py-32">
            <SectionHeading eyebrow="Pengurus" title="Struktur pengurus" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
              {profile.staff.map((member, i) => (
                <div key={member.id ?? i} data-reveal className="text-center">
                  <ArchPhoto
                    src={mediaUrl(member.photo, 'card')}
                    alt={member.name}
                    className="mx-auto aspect-[3/4] w-full max-w-[220px]"
                  />
                  <div className="mt-5 font-serif text-2xl font-semibold">{member.name}</div>
                  <div className="mt-1 text-sm text-[#0b2418]/55">{member.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
