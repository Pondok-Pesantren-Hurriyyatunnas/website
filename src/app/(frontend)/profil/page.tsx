import type { Metadata } from 'next'

import { PageHeader } from '@/components/PageHeader'
import { RichText } from '@/components/RichText'
import { mediaUrl } from '@/lib/format'
import { getProfilePage, getSiteSettings } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings()
  return {
    title: 'Profil',
    description: `Sejarah, visi misi, dan struktur pengurus ${site.name}.`,
    alternates: { canonical: '/profil' },
  }
}

export default async function ProfilePage() {
  const [site, profile] = await Promise.all([getSiteSettings(), getProfilePage()])

  return (
    <>
      <PageHeader eyebrow="Tentang kami" title="Profil Pondok" subtitle={`Mengenal lebih dekat ${site.name}.`} />

      <div className="mx-auto max-w-[74rem] space-y-3.5 px-3 pt-3.5 pb-16 sm:px-4">
        <section className="grid gap-3.5 lg:grid-cols-12">
          <div className="card-bento p-8 md:p-10 lg:col-span-8">
            <p className="text-sm font-semibold tracking-[0.15em] text-gold-600 uppercase">Sejarah singkat</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-950">Perjalanan Pondok</h2>
            <div className="mt-6">
              {profile.history ? <RichText data={profile.history} /> : <p className="text-slate-500">Sejarah pondok belum diisi.</p>}
            </div>
          </div>
          {site.foundedYear && (
            <div className="flex flex-col justify-between rounded-[28px] bg-gradient-to-br from-brand-700 to-brand-950 p-8 text-white lg:col-span-4">
              <p className="text-sm font-semibold text-gold-300">Berdiri sejak</p>
              <p className="mt-6 text-7xl font-semibold tracking-tight">{site.foundedYear}</p>
              <p className="mt-6 text-sm text-brand-100/75">{site.tagline}</p>
            </div>
          )}
        </section>

        <section className="grid gap-3.5 md:grid-cols-2">
          <div className="rings flex flex-col rounded-[28px] p-8 text-white md:p-10">
            <p className="text-sm font-semibold tracking-[0.15em] text-gold-400 uppercase">Visi</p>
            <p className="mt-6 text-2xl leading-snug font-semibold md:text-3xl">{profile.vision ? `“${profile.vision}”` : 'Visi belum diisi.'}</p>
          </div>
          <div className="card-bento p-8 md:p-10">
            <p className="text-sm font-semibold tracking-[0.15em] text-gold-600 uppercase">Misi</p>
            <ol className="mt-6 space-y-4">
              {profile.missions?.map((mission, i) => (
                <li key={mission.id ?? i} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">{i + 1}</span>
                  <span className="pt-1 text-slate-700">{mission.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {profile.staff && profile.staff.length > 0 && (
          <section className="pt-12">
            <p className="text-sm font-semibold tracking-[0.15em] text-gold-600 uppercase">Pengurus</p>
            <h2 className="mt-1 mb-6 text-3xl font-bold tracking-tight text-brand-950">Struktur Pengurus</h2>
            <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
              {profile.staff.map((member, i) => {
                const photo = mediaUrl(member.photo, 'card')
                return (
                  <div key={member.id ?? i} className="card-bento p-3">
                    {photo ? (
                      <img src={photo} alt={member.name} className="aspect-square w-full rounded-[20px] object-cover" />
                    ) : (
                      <div className="stripes aspect-square w-full rounded-[20px] bg-brand-50" />
                    )}
                    <div className="px-2 pt-4 pb-2">
                      <div className="font-bold text-brand-950">{member.name}</div>
                      <div className="text-sm text-slate-500">{member.role}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
