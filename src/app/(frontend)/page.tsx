import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Countdown } from '@/components/Countdown'
import { Logo } from '@/components/Logo'
import { categoryLabels, formatDate, getMedia, mediaUrl } from '@/lib/format'
import {
  getAdmissions,
  getGallery,
  getHomePage,
  getProgramPage,
  getPublishedNews,
  getSiteSettings,
} from '@/lib/payload'

export const metadata: Metadata = { alternates: { canonical: '/' } }

const featureIcons: ReactNode[] = [
  <path
    key="quran"
    d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
  />,
  <path
    key="kitab"
    d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
  />,
  <path
    key="school"
    d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0zM22 10v6M6 12.5V16a6 3 0 0 0 12 0v-3.5"
  />,
  <path
    key="heart"
    d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
  />,
]

function Icon({ children, className = 'h-5 w-5' }: { children: ReactNode; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function ArrowCircle({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition group-hover:rotate-45 ${
        dark ? 'bg-white text-brand-900' : 'border-[1.5px] border-brand-900/70 text-brand-900'
      }`}
    >
      <Icon className="h-4 w-4">
        <path d="M7 17 17 7M7 7h10v10" />
      </Icon>
    </span>
  )
}

function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold tracking-[0.15em] text-gold-600 uppercase">{eyebrow}</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-brand-950 md:text-4xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}

export default async function HomePage() {
  const [site, home, admissions, program, latestNews, gallery] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getAdmissions(),
    getProgramPage(),
    getPublishedNews(4),
    getGallery(),
  ])
  const heroImage = mediaUrl(home.heroImage, 'large')
  const leaderPhoto = mediaUrl(home.leaderPhoto, 'card')
  const [featuredNews, ...otherNews] = latestNews
  const photos = gallery.slice(0, 5)

  // Angka statistik dari dashboard; jika kosong, pakai data yang sudah ada
  const stats =
    home.stats && home.stats.length > 0
      ? home.stats.map((stat) => ({ value: stat.value, label: stat.label }))
      : [
          site.foundedYear && /^\d{4}$/.test(site.foundedYear)
            ? { value: site.foundedYear, label: 'Tahun berdiri' }
            : null,
          program.levels?.length
            ? { value: String(program.levels.length), label: 'Jenjang & program' }
            : null,
          program.extracurriculars?.length
            ? { value: String(program.extracurriculars.length), label: 'Ekstrakurikuler' }
            : null,
          program.dailySchedule?.length
            ? { value: String(program.dailySchedule.length), label: 'Kegiatan harian terjadwal' }
            : null,
        ].filter((stat): stat is { value: string; label: string } => stat !== null)

  return (
    <div className="mx-auto max-w-[74rem] space-y-16 px-3 pt-4 pb-16 sm:px-4 md:space-y-24">
      {/* ===== Hero bento ===== */}
      <section className="grid gap-3.5 lg:grid-cols-12">
        <div className="pattern-green relative overflow-hidden rounded-[32px] p-7 text-white sm:p-10 lg:col-span-8 lg:p-12">
          <div className="pointer-events-none absolute -right-24 -bottom-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgb(225_187_76/0.3),transparent_70%)]" />
          <p className="font-arabic text-2xl text-gold-400">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <h1 className="mt-5 text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Pondok Pesantren <span className="text-gold-400">Hurriyyatunnas</span> Bakti Awo
          </h1>
          <p className="mt-6 max-w-xl text-lg text-brand-100/85">
            {home.heroSubtitle || site.tagline}
          </p>
          <div className="relative mt-9 flex flex-wrap gap-3">
            <Link
              href="/psb"
              className="rounded-full bg-gold-400 px-7 py-3.5 font-bold text-brand-950 shadow-[0_12px_24px_-12px_rgb(225_187_76/0.8)] transition hover:-translate-y-0.5 hover:bg-gold-300"
            >
              Daftar Santri Baru {admissions.academicYear}
            </Link>
            <Link
              href="/profil"
              className="rounded-full border border-white/25 px-7 py-3.5 font-semibold transition hover:bg-white/10"
            >
              Kenali Kami
            </Link>
          </div>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
          <div className="relative min-h-64 overflow-hidden rounded-[32px] bg-brand-100">
            {heroImage ? (
              <img
                src={heroImage}
                alt={getMedia(home.heroImage)?.alt ?? site.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="stripes absolute inset-0 flex items-center justify-center">
                <div className="rounded-2xl bg-white/90 px-5 py-4 text-center shadow-sm">
                  <Logo className="mx-auto h-12 w-12" logo={site.logo} />
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    Foto pondok segera hadir
                  </p>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/psb"
            className="rings group relative flex flex-col justify-between overflow-hidden rounded-[32px] p-6 text-white"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-brand-100/70">Penerimaan Santri Baru</p>
                <p
                  className={`mt-1 text-xl font-bold ${admissions.isOpen ? 'text-gold-300' : 'text-white/70'}`}
                >
                  {admissions.isOpen ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
                </p>
              </div>
              <ArrowCircle dark />
            </div>
            {admissions.isOpen && admissions.closesAt ? (
              <div className="mt-6">
                <p className="text-xs text-brand-100/60">Ditutup dalam</p>
                <Countdown
                  target={admissions.closesAt}
                  className="text-3xl font-bold tracking-tight tabular-nums"
                  daysClassName="mr-2 text-gold-300"
                  doneClassName="text-lg font-bold text-gold-300"
                />
              </div>
            ) : (
              <p className="mt-6 text-sm text-brand-100/70">
                Tahun ajaran {admissions.academicYear}
              </p>
            )}
          </Link>
        </div>
      </section>

      {/* ===== Angka statistik ===== */}
      {stats.length > 0 && (
        <section className="-mt-8 grid grid-cols-2 gap-3.5 md:-mt-16 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`rounded-[28px] p-6 ${i === 0 ? 'bg-gradient-to-br from-brand-700 to-brand-950 text-white' : 'card-bento'}`}
            >
              <div
                className={`text-4xl font-semibold tracking-tight md:text-5xl ${i === 0 ? 'text-white' : 'text-brand-950'}`}
              >
                {stat.value}
              </div>
              <div
                className={`mt-2 text-sm font-medium ${i === 0 ? 'text-gold-300' : 'text-brand-700'}`}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ===== Keunggulan ===== */}
      {home.features && home.features.length > 0 && (
        <section>
          <SectionTitle
            eyebrow="Mengapa memilih kami"
            title={home.featuresHeading || 'Pendidikan yang Menyeluruh'}
          />
          <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-4">
            {home.features.map((feature, i) => (
              <div
                key={feature.id ?? i}
                className={`flex flex-col rounded-[28px] p-6 ${i === 0 ? 'rings text-white lg:row-span-1' : 'card-bento'}`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    i === 0 ? 'bg-white/10 text-gold-300' : 'bg-brand-50 text-brand-700'
                  }`}
                >
                  <Icon className="h-6 w-6">{featureIcons[i % featureIcons.length]}</Icon>
                </span>
                <h3
                  className={`mt-8 text-xl font-bold ${i === 0 ? 'text-white' : 'text-brand-950'}`}
                >
                  {feature.title}
                </h3>
                {feature.description && (
                  <p
                    className={`mt-2 text-sm leading-relaxed ${i === 0 ? 'text-brand-100/75' : 'text-slate-600'}`}
                  >
                    {feature.description}
                  </p>
                )}
                <span
                  className={`mt-auto pt-6 text-sm font-bold ${i === 0 ? 'text-gold-400' : 'text-brand-300'}`}
                >
                  0{i + 1}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== Sambutan pimpinan ===== */}
      <section className="grid gap-3.5 lg:grid-cols-12">
        <div className="relative min-h-80 overflow-hidden rounded-[32px] bg-brand-100 lg:col-span-5">
          {leaderPhoto ? (
            <img
              src={leaderPhoto}
              alt={home.leaderName ?? 'Pimpinan pondok'}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="stripes absolute inset-0 flex items-end p-6">
              <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-500">
                Foto pimpinan pondok
              </span>
            </div>
          )}
        </div>
        <div className="card-bento relative flex flex-col justify-center p-8 md:p-12 lg:col-span-7">
          <span className="absolute top-6 right-8 font-serif text-[120px] leading-none text-gold-400/30 select-none">
            ”
          </span>
          <p className="text-sm font-semibold tracking-[0.15em] text-gold-600 uppercase">
            Sambutan Pimpinan
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-brand-950 md:text-3xl">
            {home.welcomeHeading}
          </h2>
          <p className="mt-5 leading-relaxed whitespace-pre-line text-slate-600">
            {home.welcomeBody || site.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
            {home.leaderName ? (
              <div>
                <div className="font-bold text-brand-950">{home.leaderName}</div>
                <div className="text-sm text-slate-500">Pimpinan Pondok</div>
              </div>
            ) : (
              <span />
            )}
            <Link
              href="/profil"
              className="rounded-full border-[1.5px] border-brand-800 px-5 py-2.5 text-sm font-bold text-brand-800 transition hover:bg-brand-50"
            >
              Profil lengkap →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Jenjang pendidikan ===== */}
      {program.levels && program.levels.length > 0 && (
        <section>
          <SectionTitle
            eyebrow="Program pendidikan"
            title="Jenjang & Program"
            action={
              <Link
                href="/program"
                className="rounded-full border-[1.5px] border-brand-800 px-5 py-2.5 text-sm font-bold text-brand-800 transition hover:bg-white"
              >
                Lihat semua program
              </Link>
            }
          />
          <div className="grid gap-3.5 md:grid-cols-3">
            {program.levels.map((level, i) => (
              <Link
                key={level.id ?? i}
                href="/program"
                className="card-bento group flex flex-col p-6 transition hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full bg-gold-300/30 px-3 py-1 text-xs font-bold text-gold-600">
                    {level.label || 'Program'}
                  </span>
                  <ArrowCircle />
                </div>
                <h3 className="mt-8 text-2xl font-bold tracking-tight text-brand-950">
                  {level.name}
                </h3>
                {level.description && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{level.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== Berita ===== */}
      <section>
        <SectionTitle
          eyebrow="Kabar pondok"
          title="Berita Terbaru"
          action={
            <Link
              href="/berita"
              className="rounded-full border-[1.5px] border-brand-800 px-5 py-2.5 text-sm font-bold text-brand-800 transition hover:bg-white"
            >
              Semua berita
            </Link>
          }
        />
        {featuredNews ? (
          <div className="grid gap-3.5 lg:grid-cols-12">
            <Link
              href={`/berita/${featuredNews.slug}`}
              className="group relative min-h-96 overflow-hidden rounded-[32px] bg-brand-950 lg:col-span-7"
            >
              {mediaUrl(featuredNews.thumbnail, 'large') ? (
                <img
                  src={mediaUrl(featuredNews.thumbnail, 'large')}
                  alt={getMedia(featuredNews.thumbnail)?.alt ?? featuredNews.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="pattern-green absolute inset-0" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
                <span className="rounded-full bg-gold-400 px-3 py-1 text-xs font-bold text-brand-950">
                  {categoryLabels[featuredNews.category]}
                </span>
                <h3 className="mt-4 text-2xl leading-tight font-bold md:text-3xl">
                  {featuredNews.title}
                </h3>
                {featuredNews.excerpt && (
                  <p className="mt-3 line-clamp-2 max-w-xl text-sm text-brand-100/80">
                    {featuredNews.excerpt}
                  </p>
                )}
                <p className="mt-4 text-xs text-brand-100/60">
                  {formatDate(featuredNews.publishedAt)}
                </p>
              </div>
            </Link>
            <div className="card-bento flex flex-col p-4 lg:col-span-5">
              {otherNews.length > 0 ? (
                otherNews.map((post) => (
                  <Link
                    key={post.id}
                    href={`/berita/${post.slug}`}
                    className="group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-paper"
                  >
                    <div className="h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-brand-100">
                      {mediaUrl(post.thumbnail, 'thumbnail') ? (
                        <img
                          src={mediaUrl(post.thumbnail, 'thumbnail')}
                          alt={getMedia(post.thumbnail)?.alt ?? post.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="pattern-green flex h-full w-full items-center justify-center">
                          <Logo className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-gold-600">
                        {categoryLabels[post.category]}
                      </span>
                      <h3 className="mt-0.5 line-clamp-2 font-bold text-brand-950 group-hover:text-brand-700">
                        {post.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">{formatDate(post.publishedAt)}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="m-auto p-6 text-center text-sm text-slate-500">
                  Berita lainnya akan tampil di sini.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="card-bento p-10 text-center text-slate-500">Belum ada berita.</div>
        )}
      </section>

      {/* ===== Galeri ===== */}
      {photos.length > 0 && (
        <section>
          <SectionTitle
            eyebrow="Galeri"
            title="Suasana Pondok"
            action={
              <Link
                href="/galeri"
                className="rounded-full border-[1.5px] border-brand-800 px-5 py-2.5 text-sm font-bold text-brand-800 transition hover:bg-white"
              >
                Lihat galeri
              </Link>
            }
          />
          <div className="grid auto-rows-[160px] grid-cols-2 gap-3.5 md:auto-rows-[200px] md:grid-cols-4">
            {photos.map((photo, i) => (
              <Link
                key={photo.id}
                href="/galeri"
                className={`group relative overflow-hidden rounded-[28px] bg-brand-100 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
              >
                <img
                  src={mediaUrl(photo.image, i === 0 ? 'large' : 'card')}
                  alt={photo.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-900 opacity-0 transition group-hover:opacity-100">
                  {photo.title}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== Ajakan PSB ===== */}
      <section className="rings relative overflow-hidden rounded-[36px] p-8 text-white md:p-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold tracking-[0.15em] text-gold-400 uppercase">
              Penerimaan Santri Baru
            </p>
            <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight md:text-5xl">
              Tahun Ajaran <span className="text-gold-300">{admissions.academicYear}</span>
            </h2>
            <p className="mt-5 max-w-md text-brand-100/80">
              {admissions.isOpen
                ? 'Pendaftaran telah dibuka dan bisa dilakukan sepenuhnya secara online. Segera daftarkan putra-putri Anda.'
                : 'Pendaftaran saat ini belum dibuka. Pantau terus informasinya di halaman PSB.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/psb"
                className="rounded-full bg-gold-400 px-7 py-3.5 font-bold text-brand-950 transition hover:-translate-y-0.5 hover:bg-gold-300"
              >
                {admissions.isOpen ? 'Daftar Sekarang' : 'Lihat Info PSB'}
              </Link>
              <Link
                href="/kontak"
                className="rounded-full border border-white/25 px-7 py-3.5 font-semibold transition hover:bg-white/10"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
          {admissions.steps && admissions.steps.length > 0 && (
            <ol className="grid gap-2.5">
              {admissions.steps.map((step, i) => (
                <li
                  key={step.id ?? i}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-400 font-bold text-brand-950">
                    {i + 1}
                  </span>
                  <span className="font-semibold">{step.text}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  )
}
